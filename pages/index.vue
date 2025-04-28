<template>
  <div class="min-h-screen p-8 bg-gradient-to-b from-white to-gray-100">
    <h1 class="text-3xl font-bold mb-6">🍳 Build Your Recipe</h1>

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
      <h2 class="text-2xl font-semibold">✨ Suggested Recipes</h2>

      <div
        v-for="recipe in recipes"
        :key="recipe.id"
        class="bg-white p-4 rounded-md shadow"
      >
        <h3 class="text-xl font-bold mb-2">{{ recipe.title }}</h3>
        <p class="text-md font-bold text-gray-700">
          Ingredients:
          <span class="font-medium"> {{ recipe.ingredients.join(', ') }}</span>
        </p>
        <p class="text-gray-700 font-bold">
          Simple Instruction:
          <span class="font-medium">{{ recipe.instructions }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

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

interface Recipe {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
}

const selectedIngredients = ref<string[]>([]);
const recipes = ref<Recipe[]>([]);

const findRecipes = async () => {
  const { data } = await useFetch<Recipe[]>('/api/recipes', {
    method: 'POST',
    body: {
      ingredients: selectedIngredients.value,
    },
  });

  recipes.value = data.value || [];
};
</script>
