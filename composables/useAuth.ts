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
};
