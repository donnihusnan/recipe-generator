#TODO Remove Favorites [x] #TODO Add Favorites Page []
<script setup lang="ts">
const allIngredients = [
  'Beef',
  'Chicken',
  'Egg',
  'Bread',
  'Rice',
  'Tomato',
  'Cheese',
  'Lettuce',
  'Basil',
  'Cucumber',
  'Pasta',
  'Bacon',
  'Sausage',
  'Shrimp',
  'Salmon',
  'Turkey',
  'Spinach',
  'Mushroom',
  'Potato',
  'Tortilla',
  'Noodles',
  'Pepper',
  'Butter',
  'Mayonnaise',
  'Soy Sauce',
  'Vinegar',
  'Chili',
  'Yogurt',
  'Honey',
  'Milk',
];

type Recipe = {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
};

const selectedIngredients = ref<string[]>([]);
const recipes = ref<Recipe[]>([]);
const favorites = ref<Recipe[]>([]);

onMounted(() => {
  const stored = localStorage.getItem('favorites');
  if (stored) {
    favorites.value = JSON.parse(stored);
  }
});

const findRecipes = async () => {
  const { data } = await useFetch<Recipe[]>('/api/recipes', {
    method: 'POST',
    body: {
      ingredients: selectedIngredients.value,
    },
  });

  recipes.value = data.value || [];
};

const isFavorite = (recipe: Recipe) => {
  return favorites.value.some((r) => r.id === recipe.id);
};

const saveToFavorites = (recipe: Recipe) => {
  favorites.value.push(recipe);
  localStorage.setItem('favorites', JSON.stringify(favorites.value));
};

const removeFromFavorites = (recipe: Recipe) => {
  favorites.value = favorites.value.filter((r) => r.id !== recipe.id);
  localStorage.setItem('favorites', JSON.stringify(favorites.value));
};
</script>

<template>
  <main
    class="min-h-screen mx-auto p-8 bg-gradient-to-b from-white to-gray-100 sm:w-full md:w-full lg:w-[50%]"
  >
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold mb-6">Build Your Recipe</h1>
      <div>
        <FavouriteDropdown :favorites="favorites" />
      </div>
    </div>

    <IngredientSelector
      :ingredients="allIngredients"
      v-model="selectedIngredients"
    />

    <button
      @click="findRecipes"
      class="mt-8 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
    >
      Find Recipes
    </button>

    <div v-if="recipes.length" class="mt-12 space-y-6">
      <h2 class="text-2xl font-semibold">✨Suggested Recipes</h2>

      <div
        v-for="recipe in recipes"
        :key="recipe.id"
        class="bg-white p-4 rounded-md shadow"
      >
        <h3 class="text-xl font-bold mb-2">{{ recipe.title }}</h3>
        <p class="text-md font-bold text-gray-800">
          Ingredients:
          <span class="font-medium"> {{ recipe.ingredients.join(', ') }}</span>
        </p>
        <p class="text-gray-700 font-bold">
          Simple Instruction:
          <span class="font-medium">{{ recipe.instructions }}</span>
        </p>
        <button
          v-if="isFavorite(recipe)"
          @click="removeFromFavorites(recipe)"
          class="mt-2 bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 transition"
        >
          ❌ Remove from Favorites
        </button>

        <button
          v-else
          @click="saveToFavorites(recipe)"
          class="mt-2 bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 transition"
        >
          💾 Save to Favorites
        </button>
      </div>
    </div>
  </main>
</template>
