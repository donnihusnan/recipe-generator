<script lang="ts" setup>
import auth from '~/middleware/auth';

definePageMeta({
  middleware: auth,
});
const { createRecipe, loading, error } = useRecipes();

const { user } = useAuth();

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

const title = ref('');
const ingredient = ref('');
const instructions = ref('');
const message = ref('');;

const addRecipe = async () => {
  if (!title.value || !ingredient.value || !instructions.value) {
    message.value = 'Please fill in all fields.';
    return;
  }

  try {
    await createRecipe({
      title: title.value,
      slug: slugify(title.value),
      ingredients: ingredient.value.split(',').map((i) => i.trim()),
      instructions: instructions.value,
      user_id: user.value?.id ?? '',
    });

    message.value = 'Recipe added successfully!';
    title.value = '';
    ingredient.value = '';
    instructions.value = '';
  } catch (err) {
    message.value = 'Failed to add recipe. Please try again.';
  }
};

watch(error, (newError) => {
  if (newError) message.value = `Error: ${newError}`;
});
</script>

<template>
  <main
    class="min-h-screen mx-auto p-8 bg-gradient-to-b from-indigo-50 via-white to-cyan-50 sm:w-full lg:w-[50%]"
  >
    <div
      class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
    >
      <h2
        class="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        Add Your Recipe
      </h2>

      <form @submit.prevent="addRecipe" class="space-y-6">
        <input
          type="text"
          v-model="title"
          placeholder="Recipe Title"
          :disabled="loading"
          class="border border-gray-300 p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          required
        />

        <input
          type="text"
          v-model="ingredient"
          placeholder="Ingredients (comma separated)"
          :disabled="loading"
          class="border border-gray-300 p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          required
        />

        <textarea
          v-model="instructions"
          placeholder="Instructions"
          :disabled="loading"
          class="border border-gray-300 p-3 w-full rounded-xl h-36 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          required
        ></textarea>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-full shadow-md hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Adding Recipe...' : 'Add Recipe' }}
        </button>
      </form>

      <div
        v-if="message"
        class="mt-4 p-4 rounded-xl"
        :class="{
          'bg-green-100 text-green-800': message.includes('successfully'),
          'bg-red-100 text-red-800':
            message.includes('Error') || message.includes('Failed'),
          'bg-yellow-100 text-yellow-800':
            !message.includes('successfully') &&
            !message.includes('Error') &&
            !message.includes('Failed'),
        }"
      >
        {{ message }}
      </div>

      <NuxtLink
        to="/"
        class="inline-block mt-6 text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
      >
        ← Back to Home
      </NuxtLink>
    </div>
  </main>
</template>
