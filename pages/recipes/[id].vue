<script lang="ts" setup>
const route = useRoute();
const id = route.params.id;

const { data: recipe, error } = await useFetch(`/api/recipes/${id}`);
</script>

<template>
  <main
    class="min-h-screen mx-auto p-8 bg-gradient-to-b from-white to-gray-100 sm:w-full md:w-full lg:w-[50%]"
  >
    <h1 class="text-3xl font-bold mb-4">{{ recipe?.title }}</h1>

    <div v-if="recipe" class="bg-white p-6 rounded-md shadow space-y-4">
      <p><strong>Ingredients:</strong> {{ recipe.ingredients.join(', ') }}</p>
      <p><strong>Instructions:</strong> {{ recipe.instructions }}</p>

      <NuxtLink to="/" class="inline-block mt-4 text-blue-600 hover:underline">
        ← Back to Menu
      </NuxtLink>
    </div>

    <p v-else-if="error" class="text-gray-600">Recipe not found.</p>
  </main>
</template>
