import type { Recipe } from '@/types/recipe';
import { useSupabase } from './useSupabase';

export const useRecipes = () => {
  const supabase = useSupabase();
  const { user } = useAuth();
  const recipes = ref<Recipe[]>([]);
  const loading = ref<boolean>(false);
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

  const getRecipes = async (): Promise<void> => {
    try {
      loading.value = true;
      clearError();

      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      recipes.value = data || [];
    } catch (err) {
      handleError(err, 'fetching recipes');
      return;
    } finally {
      loading.value = false;
    }
  };

  const getRecipeById = async (id: string): Promise<Recipe | null> => {
    try {
      loading.value = true;
      clearError();

      const cachedRecipe = recipes.value.find((r) => r.id === id);
      if (cachedRecipe) {
        loading.value = false;
        return cachedRecipe;
      }

      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (supabaseError) throw supabaseError;

      if (data && !recipes.value.find((r) => r.id === data.id)) {
        recipes.value.push(data);
      }

      return data;
    } catch (err) {
      handleError(err, 'fetching recipe by ID');
      return null;
    } finally {
      loading.value = false;
    }
  };

  const getRecipeBySlug = async (slug: string): Promise<Recipe | null> => {
    try {
      loading.value = true;
      clearError();

      const cachedRecipe = recipes.value.find((r) => r.slug === slug);
      if (cachedRecipe) {
        loading.value = false;
        return cachedRecipe;
      }

      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .select('*')
        .eq('slug', slug)
        .single();

      if (supabaseError) throw supabaseError;

      if (data && !recipes.value.find((r) => r.id === data.id)) {
        recipes.value.push(data);
      }

      return data;
    } catch (err) {
      handleError(err, 'fetching recipe by slug');
      return null;
    } finally {
      loading.value = false;
    }
  };

  const getUserRecipes = async (): Promise<void> => {
    try {
      loading.value = true;
      clearError();

      if (!user.value) throw new Error('User not authenticated');

      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      recipes.value = data || [];
    } catch (err) {
      handleError(err, 'fetching user recipes');
    } finally {
      loading.value = false;
    }
  };

  const createRecipe = async (
    recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Recipe | null> => {
    try {
      loading.value = true;
      clearError();

      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .insert([recipe])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      if (data) {
        recipes.value.unshift(data);
      }

      return data;
    } catch (err) {
      handleError(err, 'creating recipe');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateRecipe = async (
    id: string,
    updates: Partial<Omit<Recipe, 'id'>>
  ): Promise<Recipe[] | null> => {
    try {
      loading.value = true;
      clearError();

      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      if (data) {
        const index = recipes.value.findIndex((r) => r.id === id);
        if (index !== -1) {
          recipes.value[index] = data;
        }
      }

      return data;
    } catch (err) {
      handleError(err, 'updating recipe');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteRecipe = async (id: string): Promise<void> => {
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

  const searchRecipes = async (query: string): Promise<Recipe[]> => {
    try {
      loading.value = true;
      clearError();

      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .select('*')
        .or(`title.ilike.%${query}%,ingredients.cs.{${query}}`)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      return data || [];
    } catch (err) {
      handleError(err, 'searching recipes');
      return [];
    } finally {
      loading.value = false;
    }
  };

  const filterByIngredients = (selectedIngredients: string[]): Recipe[] => {
    if (selectedIngredients.length === 0) return [];

    return recipes.value
      .filter((recipe) => {
        const ingredients = recipe.ingredients || [];
        return selectedIngredients.some((selected) =>
          ingredients.some((item) =>
            item.toLowerCase().includes(selected.toLowerCase())
          )
        );
      })
      .sort((a, b) => {
        const aMatches = selectedIngredients.filter((ingredient) =>
          a.ingredients?.some((recipeIngredient) =>
            recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
          )
        ).length;

        const bMatches = selectedIngredients.filter((ingredient) =>
          b.ingredients?.some((recipeIngredient) =>
            recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
          )
        ).length;

        return bMatches - aMatches;
      });
  };

  const totalRecipes = computed(() => recipes.value.length);
  const hasRecipes = computed(() => recipes.value.length > 0);
  const isLoading = computed(() => loading.value);
  const hasError = computed(() => !!error.value);

  return {
    recipes: readonly(recipes),
    loading: readonly(loading),
    error: readonly(error),
    totalRecipes,
    hasRecipes,
    isLoading,
    hasError,
    getRecipes,
    getRecipeById,
    getRecipeBySlug,
    getUserRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    filterByIngredients,
  };
};
