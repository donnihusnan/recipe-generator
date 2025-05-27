<script lang="ts" setup>
type Recipe = {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
};

const favorites = ref<Recipe[]>([]);

onMounted(() => {
  const stored = localStorage.getItem('favorites');
  if (stored) {
    favorites.value = JSON.parse(stored);
  }
});

const removeFromFavorites = (recipe: Recipe) => {
  favorites.value = favorites.value.filter((r) => r.id !== recipe.id);
  localStorage.setItem('favorites', JSON.stringify(favorites.value));
};
</script>

<template>
  <main
    class="min-h-screen mx-auto p-8 bg-gradient-to-b from-white to-gray-100 sm:w-full md:w-full lg:w-[50%]"
  >
    <h1 class="text-3xl font-bold mb-6">💾 Your Favorite Recipes</h1>

    <div v-if="favorites.length" class="space-y-6">
      <div
        v-for="recipe in favorites"
        :key="recipe.id"
        class="bg-white p-4 rounded-md shadow"
      >
        <NuxtLink
          :to="`/recipes/${recipe.id}`"
          class="text-xl font-bold mb-2"
          >{{ recipe.title }}</NuxtLink
        >
        <p>{{ recipe.ingredients.join(', ') }}</p>
        <p>{{ recipe.instructions }}</p>
        <button
          @click="removeFromFavorites(recipe)"
          class="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
        >
          ❌ Remove from Favorites
        </button>
      </div>
    </div>
    <p v-else class="text-gray-600">You have no saved recipes yet</p>
    <NuxtLink to="/" class="inline-block mt-4 text-blue-600 hover:underline">
      ← Back to Menu
    </NuxtLink>
  </main>
</template>
