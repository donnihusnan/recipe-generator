<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { useFavorites } from '@/composables/useFavorites';
import { useRecipes } from '@/composables/useRecipes';
import { useAuth } from '@/composables/useAuth';
import type { Recipe } from '@/types/recipe';

const { favorites, loadFavorites, loading: favLoading } = useFavorites();
const { getRecipeById } = useRecipes();
const { isAuthenticated } = useAuth();

const recipes = ref<Recipe[]>([]);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

const fetchFavoriteRecipes = async () => {
  if (!isAuthenticated.value) return;

  try {
    loading.value = true;
    await loadFavorites();

    const recipePromises = favorites.value.map((id) => getRecipeById(id));
    const fetchedRecipes = await Promise.all(recipePromises);
    recipes.value = fetchedRecipes.filter((r): r is Recipe => r !== null);
  } catch (err) {
    error.value = 'Failed to load favorite recipes';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchFavoriteRecipes);
</script>

<template>
  <main
    class="min-h-screen mx-auto p-8 bg-gradient-to-b from-cyan-50 via-white to-indigo-50 sm:w-full lg:w-[50%]"
  >
    <div class="mb-6">
      <NuxtLink
        to="/"
        class="inline-block text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition"
      >
        ← Back to Home
      </NuxtLink>
    </div>

    <h1
      class="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8"
    >
      My Favorite Recipes
    </h1>

    <div
      v-if="favLoading || loading"
      class="text-center text-gray-600 animate-pulse"
    >
      Loading favorites...
    </div>

    <div v-else-if="error" class="text-center text-red-600 font-medium">
      {{ error }}
    </div>

    <div v-else-if="recipes.length === 0" class="text-center text-gray-500">
      You have no favorite recipes.
    </div>

    <div class="grid gap-6" v-else>
      <div
        v-for="recipe in recipes"
        :key="recipe.id"
        class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow"
      >
        <NuxtLink :to="`/recipes/${recipe.slug}`" class="block group">
          <h2
            class="text-xl font-semibold text-indigo-700 group-hover:underline"
          >
            {{ recipe.title }}
          </h2>
          <p class="text-gray-600 text-sm mt-2">
            {{ recipe.ingredients.slice(0, 3).join(', ')
            }}{{ recipe.ingredients.length > 3 ? ', ...' : '' }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
