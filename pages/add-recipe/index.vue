<script lang="ts" setup>
const { createRecipe, loading, error } = useRecipes();

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
const message = ref('');

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
  if (newError) {
    message.value = `Error: ${newError}`;
  }
});
</script>

<template>
  <main
    class="min-h-screen mx-auto p-8 bg-gradient-to-b from-white to-gray-100 sm:w-full md:w-full lg:w-[50%]"
  >
    <h2 class="text-2xl font-bold">Add Your Recipe</h2>

    <form @submit.prevent="addRecipe" class="space-y-4">
      <input
        type="text"
        v-model="title"
        placeholder="Recipe Title"
        :disabled="loading"
        class="border p-2 w-full rounded"
        required
      />

      <input
        type="text"
        v-model="ingredient"
        placeholder="Ingredients (comma separated)"
        :disabled="loading"
        class="border p-2 w-full rounded"
        required
      />

      <textarea
        v-model="instructions"
        placeholder="Instructions"
        :disabled="loading"
        class="border p-2 w-full rounded h-32"
        required
      ></textarea>

      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white p-2 rounded w-full transition-colors"
      >
        {{ loading ? 'Adding Recipe...' : 'Add Recipe' }}
      </button>
    </form>

    <div
      v-if="message"
      class="mt-4 p-3 rounded"
      :class="{
        'bg-green-100 text-green-700': message.includes('successfully'),
        'bg-red-100 text-red-700':
          message.includes('Error') || message.includes('Failed'),
        'bg-yellow-100 text-yellow-700':
          !message.includes('successfully') &&
          !message.includes('Error') &&
          !message.includes('Failed'),
      }"
    >
      {{ message }}
    </div>
    <NuxtLink to="/" class="text-blue-600 hover:underline mt-6 block">
      ← Back to Home
    </NuxtLink>
  </main>
</template>
