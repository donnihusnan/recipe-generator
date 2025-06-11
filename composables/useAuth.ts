import type { User, Session, AuthError } from '@supabase/supabase-js';

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
};

const globalAuthState = reactive<AuthState>({
  user: null,
  session: null,
  loading: false,
  error: null,
  initialized: false,
});

export const useAuth = () => {
  const supabase = useSupabase();

  const handleError = (error: AuthError | Error | null, context: string) => {
    if (error) {
      globalAuthState.error = error.message;
      console.error(`Error in ${context}:`, error);
    } else {
      globalAuthState.error = null;
    }
  };

  const clearError = () => {
    globalAuthState.error = null;
  };

  const getCurrentSession = async () => {
    try {
      globalAuthState.loading = true;
      clearError();

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      globalAuthState.session = session;
      globalAuthState.user = session?.user || null;
      globalAuthState.initialized = true;

      return session;
    } catch (error) {
      handleError(error as AuthError, 'getting current session');
      return null;
    } finally {
      globalAuthState.loading = false;
    }
  };

  const signUp = async (email: string, password: string, metadata?: object) => {
    try {
      globalAuthState.loading = true;
      clearError();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      return data;
    } catch (error) {
      handleError(error as AuthError, 'signing up');
      return null;
    } finally {
      globalAuthState.loading = false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      globalAuthState.loading = true;
      clearError();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      globalAuthState.session = data.session;
      globalAuthState.user = data.user;

      await nextTick();

      await navigateTo('/', { replace: true });

      return data;
    } catch (error) {
      handleError(error as AuthError, 'signing in');
      throw error;
    } finally {
      globalAuthState.loading = false;
    }
  };

  const signInWithOAuth = async (provider: 'google') => {
    try {
      globalAuthState.loading = true;
      clearError();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return data;
    } catch (error) {
      handleError(error as AuthError, `signing in with ${provider}`);
      throw error;
    } finally {
      globalAuthState.loading = false;
    }
  };

  const signOut = async () => {
    try {
      globalAuthState.loading = true;
      clearError();

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      globalAuthState.session = null;
      globalAuthState.user = null;

      await nextTick();

      await navigateTo('/', { replace: true });
    } catch (error) {
      handleError(error as AuthError, 'signing out');
      throw error;
    } finally {
      globalAuthState.loading = false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      globalAuthState.loading = true;
      clearError();

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      return data;
    } catch (error) {
      handleError(error as AuthError, 'resetting password');
      throw error;
    } finally {
      globalAuthState.loading = false;
    }
  };

  const updateProfile = async (updates: { email?: string; data?: object }) => {
    try {
      globalAuthState.loading = true;
      clearError();

      const { data, error } = await supabase.auth.updateUser(updates);

      if (error) throw error;

      globalAuthState.user = data.user;

      return data;
    } catch (error) {
      handleError(error as AuthError, 'updating profile');
      throw error;
    } finally {
      globalAuthState.loading = false;
    }
  };

  const initAuthListener = () => {
    supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        console.log('Auth state change:', event, session?.user?.email);

        globalAuthState.session = session;
        globalAuthState.user = session?.user || null;
        globalAuthState.initialized = true;

        if (event === 'SIGNED_IN') {
          console.log('User signed in: ', session?.user?.email);
          if (process.client && window.location.pathname.startsWith('/auth/')) {
            await navigateTo('/', { replace: true });
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          if (
            process.client &&
            !window.location.pathname.startsWith('/auth/')
          ) {
            await navigateTo('/auth/login', { replace: true });
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        }
      }
    );
  };

  const initialize = async () => {
    if (!globalAuthState.initialized) {
      await getCurrentSession();
      initAuthListener();
    }
  };

  const isAuthenticated = computed(() => !!globalAuthState.user);
  const isLoading = computed(() => globalAuthState.loading);
  const user = computed(() => globalAuthState.user);
  const session = computed(() => globalAuthState.session);
  const error = computed(() => globalAuthState.error);
  const initialized = computed(() => globalAuthState.initialized);

  return {
    user: readonly(user),
    session: readonly(session),
    isAuthenticated,
    isLoading,
    error: readonly(error),
    initialized: readonly(initialized),

    initialize,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updateProfile,

    getCurrentSession,
    clearError,
  };
};
