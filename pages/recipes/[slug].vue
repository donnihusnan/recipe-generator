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
    class="min-h-screen mx-auto p-8 bg-gradient-to-b from-indigo-50 via-white to-cyan-50 sm:w-full lg:w-[50%]"
  >
    <div class="mb-6">
      <NuxtLink
        to="/"
        class="inline-block text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition"
      >
        ← Back to Home
      </NuxtLink>
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 animate-pulse">
      Loading recipe...
    </div>

    <div v-else-if="error" class="text-center text-red-600 font-medium">
      {{ error }}
    </div>

    <div
      v-else-if="recipe"
      class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
    >
      <h1
        class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6"
      >
        {{ recipe.title }}
      </h1>

      <section class="mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-2">Ingredients</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="ingredient in recipe.ingredients"
            :key="ingredient"
            class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm shadow-sm hover:scale-105 transition-transform"
          >
            {{ ingredient }}
          </span>
        </div>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-800 mb-2">Instructions</h2>
        <p class="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
          {{ recipe.instructions }}
        </p>
      </section>
    </div>
  </main>
</template>
