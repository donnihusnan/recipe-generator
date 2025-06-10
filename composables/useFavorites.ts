import { ref, readonly } from 'vue';
import { useSupabase } from './useSupabase';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const supabase = useSupabase();
  const { user, isAuthenticated } = useAuth();

  // Changed from number[] to string[] for UUIDs
  const favorites = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const handleError = (err: unknown, context: string) => {
    const errorMessage =
      err instanceof Error ? err.message : 'An unknown error occurred';
    error.value = errorMessage;
    console.error(`Error in ${context}:`, err);
  };

  const clearError = () => {
    error.value = null;
  };

  const loadFavorites = async () => {
    if (!isAuthenticated.value || !user.value) {
      console.warn('User not authenticated, cannot load favorites');
      return;
    }

    try {
      loading.value = true;
      clearError();

      const { data, error: supabaseError } = await supabase
        .from('favorites')
        .select('recipe_id')
        .eq('user_id', user.value.id);

      if (supabaseError) throw supabaseError;

      favorites.value =
        data?.map((fav: { recipe_id: string }) => fav.recipe_id) || [];

      console.log('Loaded favorites:', favorites.value);
    } catch (err) {
      handleError(err, 'loading favorites');
    } finally {
      loading.value = false;
    }
  };

  const addFavorite = async (recipeId: string) => {
    if (!isAuthenticated.value || !user.value) {
      console.warn('User not authenticated, cannot add favorite');
      return;
    }

    // Check if already favorited to prevent duplicates
    if (favorites.value.includes(recipeId)) {
      console.log('Recipe already in favorites');
      return;
    }

    try {
      loading.value = true;
      clearError();

      const { error: supabaseError } = await supabase
        .from('favorites')
        .insert([{ user_id: user.value.id, recipe_id: recipeId }]);

      if (supabaseError) throw supabaseError;

      // Update local state
      favorites.value.push(recipeId);
      console.log('Added favorite:', recipeId);
    } catch (err) {
      handleError(err, 'adding favorite');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const removeFavorite = async (recipeId: string) => {
    if (!isAuthenticated.value || !user.value) {
      console.warn('User not authenticated, cannot remove favorite');
      return;
    }

    try {
      loading.value = true;
      clearError();

      const { error: supabaseError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.value.id)
        .eq('recipe_id', recipeId);

      if (supabaseError) throw supabaseError;

      // Update local state
      favorites.value = favorites.value.filter((id) => id !== recipeId);
      console.log('Removed favorite:', recipeId);
    } catch (err) {
      handleError(err, 'removing favorite');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const isFavorite = (recipeId: string): boolean => {
    return favorites.value.includes(recipeId);
  };

  const clearFavorites = () => {
    favorites.value = [];
    error.value = null;
  };

  return {
    favorites: readonly(favorites),
    loading: readonly(loading),
    error: readonly(error),
    loadFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
  };
};
