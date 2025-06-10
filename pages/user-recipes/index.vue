<template>
  <main class="min-h-screen mx-auto p-8 sm:w-full md:w-full lg:w-[50%]">
    <h1 class="text-4xl font-bold mb-4">Your Recipes</h1>

    <div v-if="loading" class="text-center py-16">
      <p>Loading your recipes...</p>
    </div>

    <div v-else-if="userRecipes.length === 0" class="text-center py-16">
      <p>You have not created any recipes yet.</p>
    </div>

    <div v-else>
      <div
        v-for="recipe in userRecipes"
        :key="recipe.id"
        class="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm"
      >
        <!-- Edit Mode -->
        <div v-if="editingRecipeId === recipe.id" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Title</label
            >
            <input
              v-model="editForm.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Recipe title"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Instructions</label
            >
            <textarea
              v-model="editForm.instructions"
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Recipe instructions"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Ingredients</label
            >
            <div class="space-y-2">
              <div
                v-for="(ingredient, index) in editForm.ingredients"
                :key="index"
                class="flex gap-2"
              >
                <input
                  v-model="editForm.ingredients[index]"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingredient"
                />
                <button
                  @click="removeIngredient(index)"
                  class="px-3 py-2 text-red-600 hover:text-red-800"
                  type="button"
                >
                  Remove
                </button>
              </div>
              <button
                @click="addIngredient"
                class="text-blue-600 hover:text-blue-800 text-sm"
                type="button"
              >
                + Add Ingredient
              </button>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              @click="saveEdit(recipe.id)"
              :disabled="isUpdating"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isUpdating ? 'Saving...' : 'Save Changes' }}
            </button>
            <button
              @click="cancelEdit"
              class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>

        <!-- View Mode -->
        <div v-else>
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-semibold">{{ recipe.title }}</h2>
            <div class="flex gap-2">
              <button
                @click="startEdit(recipe)"
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(recipe.id, recipe.title)"
                class="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          <div
            v-if="recipe.ingredients && recipe.ingredients.length > 0"
            class="mb-4"
          >
            <h3 class="font-semibold mb-2">Ingredients:</h3>
            <ul class="list-disc list-inside space-y-1">
              <li
                v-for="ingredient in recipe.ingredients"
                :key="ingredient"
                class="text-gray-700"
              >
                {{ ingredient }}
              </li>
            </ul>
          </div>

          <div class="mb-4">
            <h3 class="font-semibold mb-2">Instructions:</h3>
            <p class="text-gray-700 whitespace-pre-wrap">
              {{ recipe.instructions }}
            </p>
          </div>

          <button
            @click="toggleFavorite(recipe.id)"
            class="px-4 py-2 text-sm border rounded-md transition-colors"
            :class="
              isFavorite(recipe.id)
                ? 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200'
                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
            "
          >
            {{
              isFavorite(recipe.id)
                ? '★ Remove from Favorites'
                : '☆ Add to Favorites'
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Delete Recipe</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "{{ recipeToDelete.title }}"? This
          action cannot be undone.
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="cancelDelete"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            @click="deleteRecipeConfirmed"
            :disabled="isDeleting"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

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

// Edit form state
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
  // Reset form
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

    // Filter out empty ingredients
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

    // Reset edit state
    editingRecipeId.value = null;

    // Show success message (you might want to add a toast notification here)
    console.log('Recipe updated successfully');
  } catch (error) {
    console.error('Error updating recipe:', error);
    // Handle error (you might want to show an error message to the user)
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

    // Close modal
    showDeleteModal.value = false;
    recipeToDelete.value = { id: '', title: '' };

    console.log('Recipe deleted successfully');
  } catch (error) {
    console.error('Error deleting recipe:', error);
    // Handle error (you might want to show an error message to the user)
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
