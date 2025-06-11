<script setup lang="ts">
import { useRecipes } from '@/composables/useRecipes';
import { useFavorites } from '@/composables/useFavorites';
import { useAuth } from '@/composables/useAuth';

const { recipes, getRecipes, updateRecipe, deleteRecipe } = useRecipes();
const { loadFavorites, addFavorite, removeFavorite, favorites } =
  useFavorites();
const { user } = useAuth();

const loading = ref(true);
const editingRecipeId = ref<string | null>(null);
const isUpdating = ref(false);
const isDeleting = ref(false);
const showDeleteModal = ref(false);
const recipeToDelete = ref({ id: '', title: '' });

const editForm = reactive({
  title: '',
  instructions: '',
  ingredients: [] as string[],
});

const userRecipes = computed(() => {
  if (!user.value) return [];
  return recipes.value.filter((recipe) => recipe.user_id === user.value?.id);
});

const toggleFavorite = (recipeId: string) => {
  if (isFavorite(recipeId)) {
    removeFavorite(recipeId);
  } else {
    addFavorite(recipeId);
  }
};

const isFavorite = (recipeId: string) => {
  return favorites.value.includes(recipeId);
};

const startEdit = (recipe: any) => {
  editingRecipeId.value = recipe.id;
  editForm.title = recipe.title || '';
  editForm.instructions = recipe.instructions || '';
  editForm.ingredients = recipe.ingredients ? [...recipe.ingredients] : [''];
};

const cancelEdit = () => {
  editingRecipeId.value = null;
  editForm.title = '';
  editForm.instructions = '';
  editForm.ingredients = [];
};

const addIngredient = () => {
  editForm.ingredients.push('');
};

const removeIngredient = (index: number) => {
  editForm.ingredients.splice(index, 1);
};

const saveEdit = async (recipeId: string) => {
  try {
    isUpdating.value = true;

    const cleanedIngredients = editForm.ingredients.filter(
      (ingredient) => ingredient.trim() !== ''
    );

    const updates = {
      title: editForm.title.trim(),
      instructions: editForm.instructions.trim(),
      ingredients: cleanedIngredients,
      updated_at: new Date().toISOString(),
    };

    await updateRecipe(recipeId, updates);

    editingRecipeId.value = null;

    console.log('Recipe updated successfully');
  } catch (error) {
    console.error('Error updating recipe:', error);
  } finally {
    isUpdating.value = false;
  }
};

const confirmDelete = (recipeId: string, recipeTitle: string) => {
  recipeToDelete.value = { id: recipeId, title: recipeTitle };
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  recipeToDelete.value = { id: '', title: '' };
};

const deleteRecipeConfirmed = async () => {
  try {
    isDeleting.value = true;
    await deleteRecipe(recipeToDelete.value.id);

    showDeleteModal.value = false;
    recipeToDelete.value = { id: '', title: '' };

    console.log('Recipe deleted successfully');
  } catch (error) {
    console.error('Error deleting recipe:', error);
  } finally {
    isDeleting.value = false;
  }
};

onMounted(async () => {
  try {
    await getRecipes();
    await loadFavorites();
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main class="min-h-screen mx-auto p-8 sm:w-full md:w-full lg:w-[50%]">
    <div class="text-center mb-8">
      <div
        class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4"
      >
        <h1 class="text-4xl font-bold mb-2">Your Recipes</h1>
        <p class="text-gray-600 text-lg">
          Manage and edit your personal recipe collection
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div
        class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
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
            <p class="text-blue-100 text-sm">Your Recipes</p>
            <p class="text-2xl font-bold">{{ userRecipes.length }}</p>
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
                fill-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p class="text-emerald-100 text-sm">Favorites</p>
            <p class="text-2xl font-bold">
              {{ userRecipes.filter((recipe) => isFavorite(recipe.id)).length }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-16">
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
      <p class="text-xl text-gray-600">Loading your recipes...</p>
    </div>

    <div v-else-if="userRecipes.length === 0" class="text-center py-16">
      <div
        class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200"
      >
        <div class="text-6xl mb-4">👨‍🍳</div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">No recipes yet</h3>
        <p class="text-gray-600 mb-4">You haven't created any recipes yet.</p>
        <NuxtLink
          to="/add-recipe"
          class="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Create Your First Recipe</span>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div class="text-center mb-8">
        <h2
          class="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
        >
          {{ userRecipes.length }} Recipe{{ userRecipes.length > 1 ? 's' : '' }}
        </h2>
      </div>

      <div class="grid gap-8">
        <div
          v-for="recipe in userRecipes"
          :key="recipe.id"
          class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
        >
          <div v-if="editingRecipeId === recipe.id" class="p-8">
            <div class="mb-6">
              <h3
                class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center"
              >
                <span
                  class="bg-gradient-to-r from-orange-400 to-pink-400 w-2 h-8 rounded-full mr-3"
                ></span>
                Edit Recipe
              </h3>
            </div>

            <div class="space-y-6">
              <div>
                <label
                  class="text-sm font-semibold text-gray-800 mb-3 flex items-center"
                >
                  <span
                    class="bg-gradient-to-r from-blue-400 to-purple-400 w-1 h-6 rounded-full mr-2"
                  ></span>
                  Recipe Title
                </label>
                <input
                  v-model="editForm.title"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
                  placeholder="Enter recipe title"
                />
              </div>

              <div>
                <label
                  class="text-sm font-semibold text-gray-800 mb-3 flex items-center"
                >
                  <span
                    class="bg-gradient-to-r from-green-400 to-blue-400 w-1 h-6 rounded-full mr-2"
                  ></span>
                  Ingredients
                </label>
                <div class="space-y-3">
                  <div
                    v-for="(ingredient, index) in editForm.ingredients"
                    :key="index"
                    class="flex gap-3"
                  >
                    <input
                      v-model="editForm.ingredients[index]"
                      type="text"
                      class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
                      placeholder="Enter ingredient"
                    />
                    <button
                      @click="removeIngredient(index)"
                      class="px-4 py-3 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-xl hover:from-red-200 hover:to-pink-200 transform hover:scale-105 transition-all duration-300 font-medium"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    @click="addIngredient"
                    class="text-indigo-600 hover:text-purple-600 text-sm font-medium flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full hover:from-indigo-100 hover:to-purple-100 transition-all duration-300"
                    type="button"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Add Ingredient</span>
                  </button>
                </div>
              </div>

              <div>
                <label
                  class="text-sm font-semibold text-gray-800 mb-3 flex items-center"
                >
                  <span
                    class="bg-gradient-to-r from-orange-400 to-red-400 w-1 h-6 rounded-full mr-2"
                  ></span>
                  Instructions
                </label>
                <textarea
                  v-model="editForm.instructions"
                  rows="6"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 resize-none"
                  placeholder="Enter recipe instructions"
                ></textarea>
              </div>

              <div class="flex gap-4 pt-4">
                <button
                  @click="saveEdit(recipe.id)"
                  :disabled="isUpdating"
                  class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 font-medium shadow-lg flex items-center space-x-2"
                >
                  <svg
                    v-if="isUpdating"
                    class="w-4 h-4 animate-spin"
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
                  <svg
                    v-else
                    class="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ isUpdating ? 'Saving...' : 'Save Changes' }}</span>
                </button>
                <button
                  @click="cancelEdit"
                  class="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transform hover:scale-105 transition-all duration-300 font-medium flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="p-8">
            <div class="flex justify-between items-start mb-6">
              <h2
                class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all duration-300 group-hover:scale-105"
              >
                {{ recipe.title }}
              </h2>

              <div class="flex gap-2">
                <button
                  @click="startEdit(recipe)"
                  class="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:from-blue-200 hover:to-indigo-200 transform hover:scale-110 transition-all duration-300 shadow-md flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                    />
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  @click="confirmDelete(recipe.id, recipe.title)"
                  class="bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium hover:from-red-200 hover:to-pink-200 transform hover:scale-110 transition-all duration-300 shadow-md flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>

            <div
              v-if="recipe.ingredients && recipe.ingredients.length > 0"
              class="mb-6"
            >
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
                  class="px-3 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 transition-all duration-300"
                >
                  {{ ingredient }}
                </span>
              </div>
            </div>

            <div class="mb-6">
              <p class="font-semibold text-gray-800 mb-3 flex items-center">
                <span
                  class="bg-gradient-to-r from-orange-400 to-red-400 w-1 h-6 rounded-full mr-2"
                ></span>
                Instructions:
              </p>
              <div
                class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100"
              >
                <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {{ recipe.instructions }}
                </p>
              </div>
            </div>

            <button
              @click="toggleFavorite(recipe.id)"
              :class="[
                'px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 transform hover:scale-110 shadow-md',
                isFavorite(recipe.id)
                  ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 hover:from-red-200 hover:to-pink-200'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-indigo-100 hover:to-purple-100 hover:text-indigo-700',
              ]"
            >
              {{
                isFavorite(recipe.id)
                  ? '❤️ Remove from Favorites'
                  : '🤍 Add to Favorites'
              }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20"
      >
        <div class="text-center mb-6">
          <div
            class="bg-gradient-to-r from-red-100 to-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Delete Recipe</h3>
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete "<span
              class="font-semibold text-gray-800"
              >{{ recipeToDelete.title }}</span
            >"? This action cannot be undone.
          </p>
        </div>
        <div class="flex gap-3 justify-center">
          <button
            @click="cancelDelete"
            class="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transform hover:scale-105 transition-all duration-300 font-medium"
          >
            Cancel
          </button>
          <button
            @click="deleteRecipeConfirmed"
            :disabled="isDeleting"
            class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 font-medium flex items-center space-x-2"
          >
            <svg
              v-if="isDeleting"
              class="w-4 h-4 animate-spin"
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
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ isDeleting ? 'Deleting...' : 'Delete Recipe' }}</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
