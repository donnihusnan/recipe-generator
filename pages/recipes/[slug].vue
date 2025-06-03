<script lang="ts" setup>
import type { Recipe } from '@/types/recipe';

const route = useRoute();
const slug = route.params.slug as string;

const { getRecipeBySlug, isLoading } = useRecipes();
const recipe = ref<Recipe | null>(null);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const data = await getRecipeBySlug(slug);
    if (!data) {
      error.value = 'Recipe not found';
    } else {
      recipe.value = data;
    }
  } catch (err) {
    console.error(err);
    error.value = 'An error occurred while fetching the recipe.';
  }
});
</script>

<template>
  <main
    class="min-h-screen mx-auto p-8 bg-gradient-to-b from-white to-gray-100 sm:w-full md:w-full lg:w-[50%]"
  >
    <div class="mb-6">
      <NuxtLink to="/" class="text-blue-600 hover:underline"
        >← Back to Home</NuxtLink
      >
    </div>

    <div v-if="isLoading" class="text-center text-gray-600">
      Loading recipe...
    </div>

    <div v-else-if="error" class="text-center text-red-600">
      {{ error }}
    </div>

    <div v-else-if="recipe" class="bg-white p-6 rounded-lg shadow">
      <h1 class="text-3xl font-bold text-blue-700 mb-4">{{ recipe.title }}</h1>

      <section class="mb-4">
        <h2 class="font-semibold text-gray-800 mb-2">Ingredients</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="ingredient in recipe.ingredients"
            :key="ingredient"
            class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
          >
            {{ ingredient }}
          </span>
        </div>
      </section>

      <section>
        <h2 class="font-semibold text-gray-800 mb-2">Instructions</h2>
        <p class="text-gray-700 leading-relaxed text-sm">
          {{ recipe.instructions }}
        </p>
      </section>
    </div>
  </main>
</template>
