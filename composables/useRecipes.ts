import type { Recipe } from '@/types/recipe';
import { useSupabase } from './useSupabase';

export const useRecipes = () => {
  const supabase = useSupabase();
  const recipes = ref<Recipe[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const getRecipes = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .select('*');

      if (supabaseError) throw supabaseError;

      recipes.value = data || [];
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      error.value = errorMessage;
      console.error('Error fetching recipes:', err);
    } finally {
      loading.value = false;
    }
  };

  const createRecipe = async (
    recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Recipe[] | null> => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .insert([recipe])
        .select();

      if (supabaseError) throw supabaseError;

      if (data) {
        recipes.value.push(...data);
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      error.value = errorMessage;
      console.error('Error creating recipe:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateRecipe = async (
    id: number,
    updates: Partial<Omit<Recipe, 'id'>>
  ): Promise<Recipe[] | null> => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', id)
        .select();

      if (supabaseError) throw supabaseError;

      if (data && data[0]) {
        const index = recipes.value.findIndex((r: Recipe) => r.id === id);
        if (index !== -1) {
          recipes.value[index] = data[0];
        }
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      error.value = errorMessage;
      console.error('Error updating recipe:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteRecipe = async (id: number): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      const { error: supabaseError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      recipes.value = recipes.value.filter((r: Recipe) => r.id !== id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      error.value = errorMessage;
      console.error('Error deleting recipe:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    recipes: readonly(recipes),
    loading: readonly(loading),
    error: readonly(error),
    getRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
};
