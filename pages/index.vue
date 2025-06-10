<script setup lang="ts">
import type { Recipe } from '@/types/recipe';
import { useAuth } from '~/composables/useAuth';

const {
  getRecipes,
  filterByIngredients,
  isLoading: recipesLoading,
  totalRecipes,
} = useRecipes();

const { loadFavorites, addFavorite, removeFavorite, favorites } =
  useFavorites();

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
const localLoading = ref(false);

const filteredRecipes = computed(() => {
  return filterByIngredients(selectedIngredients.value);
});

const isLoading = computed(() => recipesLoading.value || localLoading.value);

const isFavorite = (recipeId: string): boolean => {
  return favorites.value.includes(recipeId);
};

const saveToFavorites = async (recipeId: string) => {
  await addFavorite(recipeId);
};

const removeFromFavorites = async (recipeId: string) => {
  await removeFavorite(recipeId);
};

onMounted(async () => {
  await loadFavorites();
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
  <main class="min-h-screen mx-auto p-8 sm:w-full md:w-full lg:w-[50%]">
    <!-- Hero Section -->
    <div class="text-center mb-8">
      <div
        class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4"
      >
        <h1 class="text-4xl font-bold mb-2">Find Your Perfect Recipe</h1>
        <p class="text-gray-600 text-lg">
          Select ingredients and discover amazing dishes
        </p>
      </div>
    </div>

    <!-- Enhanced Ingredient Selector -->
    <div
      class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8"
    >
      <h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <span
          class="bg-gradient-to-r from-orange-400 to-pink-400 w-2 h-8 rounded-full mr-3"
        ></span>
        Choose Your Ingredients
      </h2>
      <IngredientSelector
        :ingredients="allIngredients"
        v-model="selectedIngredients"
      />
    </div>

    <!-- Stats Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div
        class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        <div class="flex items-center">
          <div class="bg-white/20 rounded-full p-3 mr-4">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-blue-100 text-sm">Selected Ingredients</p>
            <p class="text-2xl font-bold">{{ selectedIngredients.length }}</p>
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        <div class="flex items-center">
          <div class="bg-white/20 rounded-full p-3 mr-4">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M12 6V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2z"
              />
            </svg>
          </div>
          <div>
            <p class="text-emerald-100 text-sm">Total Recipes</p>
            <p class="text-2xl font-bold">{{ totalRecipes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected ingredients display -->
    <div v-if="selectedIngredients.length > 0" class="mb-6">
      <div
        class="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-r-xl p-4"
      >
        <p class="text-amber-800 font-medium mb-2">Selected Ingredients:</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="ingredient in selectedIngredients"
            :key="ingredient"
            class="bg-gradient-to-r from-amber-200 to-amber-300 text-amber-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
          >
            {{ ingredient }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-16">
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4 animate-pulse"
      >
        <svg
          class="w-8 h-8 text-white animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <p class="text-xl text-gray-600">
        {{ recipesLoading ? 'Loading recipes...' : 'Finding recipes...' }}
      </p>
    </div>

    <!-- Recipe Results -->
    <div v-else-if="filteredRecipes.length" class="space-y-6">
      <div class="text-center mb-8">
        <h2
          class="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
        >
          Found {{ filteredRecipes.length }} Recipe{{
            filteredRecipes.length > 1 ? 's' : ''
          }}
        </h2>
      </div>

      <div class="grid gap-8">
        <div
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
        >
          <div class="p-8">
            <div class="flex justify-between items-start mb-6">
              <NuxtLink
                :to="`/recipes/${recipe.slug}`"
                class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all duration-300 group-hover:scale-105"
              >
                {{ recipe.title }}
              </NuxtLink>

              <button
                v-if="isFavorite(recipe.id)"
                @click="removeFromFavorites(recipe.id)"
                class="bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium hover:from-red-200 hover:to-pink-200 transform hover:scale-110 transition-all duration-300 shadow-md"
              >
                ❤️ Favorited
              </button>
              <button
                v-else
                @click="saveToFavorites(recipe.id)"
                class="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:from-indigo-100 hover:to-purple-100 hover:text-indigo-700 transform hover:scale-110 transition-all duration-300 shadow-md"
              >
                🤍 Add to Favorites
              </button>
            </div>

            <div class="mb-6">
              <p class="font-semibold text-gray-800 mb-3 flex items-center">
                <span
                  class="bg-gradient-to-r from-green-400 to-blue-400 w-1 h-6 rounded-full mr-2"
                ></span>
                Ingredients:
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="ingredient in recipe.ingredients"
                  :key="ingredient"
                  :class="[
                    'px-3 py-2 rounded-full text-sm font-medium transition-all duration-300',
                    selectedIngredients.some((selected) =>
                      ingredient.toLowerCase().includes(selected.toLowerCase())
                    )
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 ring-2 ring-green-200 shadow-md transform scale-105'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300',
                  ]"
                >
                  {{ ingredient }}
                </span>
              </div>
            </div>

            <div>
              <p class="font-semibold text-gray-800 mb-3 flex items-center">
                <span
                  class="bg-gradient-to-r from-orange-400 to-red-400 w-1 h-6 rounded-full mr-2"
                ></span>
                Instructions:
              </p>
              <div
                class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100"
              >
                <p class="text-gray-700 leading-relaxed">
                  {{ recipe.instructions }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results State -->
    <div v-else-if="selectedIngredients.length > 0" class="text-center py-16">
      <div
        class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200"
      >
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">No recipes found</h3>
        <p class="text-gray-600 mb-4">
          No recipes match your selected ingredients.
        </p>
        <p class="text-sm text-gray-500">
          Try selecting different ingredients or add a new recipe!
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <div
        class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200"
      >
        <div class="text-6xl mb-4">👨‍🍳</div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Ready to cook?</h3>
        <p class="text-gray-600">
          Select ingredients above to find matching recipes
        </p>
      </div>
    </div>
  </main>
</template>
