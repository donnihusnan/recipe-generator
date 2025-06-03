<script setup lang="ts">
import type { Recipe } from '@/types/recipe';

const {
  getRecipes,
  filterByIngredients,
  isLoading: recipesLoading,
  totalRecipes,
} = useRecipes();

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

const selectedIngredients = ref<string[]>([]);
const favorites = ref<Recipe[]>([]);
const localLoading = ref(false);

const filteredRecipes = computed(() => {
  return filterByIngredients(selectedIngredients.value);
});

const isLoading = computed(() => recipesLoading.value || localLoading.value);

const loadFavorites = () => {
  if (process.client) {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      try {
        favorites.value = JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        favorites.value = [];
      }
    }
  }
};

const saveFavoritesToStorage = () => {
  if (process.client) {
    localStorage.setItem('favorites', JSON.stringify(favorites.value));
  }
};

const isFavorite = (recipe: Recipe): boolean => {
  return favorites.value.some((r) => r.id === recipe.id);
};

const saveToFavorites = (recipe: Recipe) => {
  if (!isFavorite(recipe)) {
    favorites.value.push(recipe);
    saveFavoritesToStorage();
  }
};

const removeFromFavorites = (recipe: Recipe) => {
  favorites.value = favorites.value.filter((r) => r.id !== recipe.id);
  saveFavoritesToStorage();
};

onMounted(async () => {
  loadFavorites();

  if (totalRecipes.value === 0) {
    await getRecipes();
  }
});

watch(
  selectedIngredients,
  async (newIngredients) => {
    if (newIngredients.length > 0) {
      localLoading.value = true;

      await new Promise((resolve) => setTimeout(resolve, 100));

      localLoading.value = false;
    }
  },
  { deep: true }
);
</script>

<template>
  <main
    class="min-h-screen mx-auto p-8 bg-gradient-to-b from-white to-gray-100 sm:w-full md:w-full lg:w-[50%]"
  >
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold mb-6">Build Your Recipe</h1>
      <NuxtLink to="/favorites" class="text-blue-600 hover:underline">
        Favorites
      </NuxtLink>
      <NuxtLink to="/add-recipe" class="text-blue-600 hover:underline">
        Add Recipe
      </NuxtLink>
    </div>

    <IngredientSelector
      :ingredients="allIngredients"
      v-model="selectedIngredients"
    />

    <div class="mt-4 text-sm text-gray-600">
      <p v-if="selectedIngredients.length > 0">
        Selected: {{ selectedIngredients.join(', ') }}
      </p>
      <p v-if="totalRecipes > 0">
        Total recipes in database: {{ totalRecipes }}
      </p>
    </div>

    <div v-if="isLoading" class="mt-8 text-center">
      <p>{{ recipesLoading ? 'Loading recipes...' : 'Finding recipes...' }}</p>
    </div>

    <div v-else-if="filteredRecipes.length" class="mt-12 space-y-6">
      <h2 class="text-2xl font-semibold">
        Found {{ filteredRecipes.length }} Recipe{{
          filteredRecipes.length > 1 ? 's' : ''
        }}
      </h2>

      <div
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        class="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <NuxtLink
            :to="`/recipes/${recipe.slug}`"
            class="text-xl font-bold text-blue-600 hover:text-blue-800"
          >
            {{ recipe.title }}
          </NuxtLink>

          <button
            v-if="isFavorite(recipe)"
            @click="removeFromFavorites(recipe)"
            class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm hover:bg-red-200 transition"
          >
            ❤️ Favorited
          </button>
          <button
            v-else
            @click="saveToFavorites(recipe)"
            class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition"
          >
            🤍 Add to Favorites
          </button>
        </div>

        <div class="mb-3">
          <p class="font-semibold text-gray-800 mb-1">Ingredients:</p>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="ingredient in recipe.ingredients"
              :key="ingredient"
              :class="[
                'px-2 py-1 rounded-full text-xs',
                selectedIngredients.some((selected) =>
                  ingredient.toLowerCase().includes(selected.toLowerCase())
                )
                  ? 'bg-green-100 text-green-800 font-medium'
                  : 'bg-gray-100 text-gray-600',
              ]"
            >
              {{ ingredient }}
            </span>
          </div>
        </div>

        <div>
          <p class="font-semibold text-gray-800 mb-1">Instructions:</p>
          <p class="text-gray-700 text-sm leading-relaxed">
            {{ recipe.instructions }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-else-if="selectedIngredients.length > 0"
      class="mt-12 text-center text-gray-500"
    >
      <p>No recipes found with those ingredients.</p>
      <p class="text-sm mt-2">
        Try selecting different ingredients or add a new recipe!
      </p>
    </div>

    <div v-else class="mt-12 text-center text-gray-500">
      <p>Select ingredients above to find matching recipes</p>
    </div>
  </main>
</template>
