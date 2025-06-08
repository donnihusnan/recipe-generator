import type { User, Session, AuthError } from '@supabase/supabase-js';

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
};

export const useAuth = () => {
  const supabase = useSupabase();

  const state = reactive<AuthState>({
    user: null,
    session: null,
    loading: false,
    error: null,
  });

  const handleError = (error: AuthError | Error | null, context: string) => {
    if (error) {
      state.error = error.message;
      console.error(`Error in ${context}:`, error);
    } else {
      state.error = null;
    }
  };

  const clearError = () => {
    state.error = null;
  };

  const getCurrentSession = async () => {
    try {
      state.loading = true;
      clearError();

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;

      state.session = session;
      state.user = session?.user || null;

      return session;
    } catch (error) {
      handleError(error as AuthError, 'getting current session');
      return null;
    } finally {
      state.loading = false;
    }
  };

  const signUp = async (email: string, password: string, metadata?: object) => {
    try {
      state.loading = true;
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
      state.loading = false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      state.loading = true;
      clearError();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      state.session = data.session;
      state.user = data.user;

      return data;
    } catch (error) {
      handleError(error as AuthError, 'signing in');
      throw error;
    } finally {
      state.loading = false;
    }
  };

  const signInWithGoogle = async (provider: 'google') => {
    try {
      state.loading = true;
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
      state.loading = false;
    }
  };

  const signOut = async () => {
    try {
      state.loading = true;
      clearError();

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      state.session = null;
      state.user = null;

      await navigateTo('/');
    } catch (error) {
      handleError(error as AuthError, 'signing out');
      throw error;
    } finally {
      state.loading = false;
    }
  };
  const resetPassword = async (email: string) => {
    try {
      state.loading = true;
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
      state.loading = false;
    }
  };

  const updateProfile = async (updates: { email?: string; data?: object }) => {
    try {
      state.loading = true;
      clearError();

      const { data, error } = await supabase.auth.updateUser(updates);

      if (error) throw error;

      state.user = data.user;

      return data;
    } catch (error) {
      handleError(error as AuthError, 'updating profile');
      throw error;
    } finally {
      state.loading = false;
    }
  };

  const initAuthListener = () => {
    supabase.auth.onAuthStateChange(
      (event: string, session: Session | null) => {
        state.session = session;
        state.user = session?.user || null;

        if (event === 'SIGNED_IN') {
          console.log('User signed in: ', session?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        }
      }
    );
  };

  const initialize = async () => {
    await getCurrentSession();
    initAuthListener();
  };

  const isAuthenticated = computed(() => !!state.user);
  const isLoading = computed(() => state.loading);
  const user = computed(() => state.user);
  const session = computed(() => state.session);
  const error = computed(() => state.error);

  return {
    user: readonly(user),
    session: readonly(session),
    isAuthenticated,
    isLoading,
    error: readonly(error),

    initialize,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,

    getCurrentSession,
    clearError,
  };
};
