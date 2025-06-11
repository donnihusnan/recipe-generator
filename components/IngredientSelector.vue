<template>
  <div>
    <div class="flex flex-wrap gap-4 mb-4">
      <div
        v-for="ingredient in ingredients"
        :key="ingredient"
        class="flex flex-wrap grow items-center gap-2 bg-gray-100 p-2 rounded-md shadow hover:bg-gray-200 cursor-pointer"
      >
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            :value="ingredient"
            v-model="localSelectedIngredients"
            class="accent-pink-500"
          />
          {{ ingredient }}
        </label>
      </div>
    </div>

    <div class="mb-4">
      <input
        v-model="customInputValue"
        @input="handleCustomInputChange"
        type="text"
        placeholder="Add custom ingredients (comma separated)"
        class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
        aria-label="Add custom ingredients"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  ingredients: string[];
  modelValue: string[];
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const customInputValue = ref('');
const customIngredients = ref<string[]>([]);
const localSelectedIngredients = ref<string[]>(props.modelValue ?? []);

const allSelectedIngredients = computed(() => [
  ...localSelectedIngredients.value,
  ...customIngredients.value,
]);

function handleCustomInputChange() {
  const enteredIngredients = customInputValue.value
    .split(',')
    .map((i) => i.trim())
    .filter((i) => i.length > 0);

  customIngredients.value = enteredIngredients;

  emits('update:modelValue', allSelectedIngredients.value);
}

watch(
  localSelectedIngredients,
  (newVal) => {
    emits('update:modelValue', allSelectedIngredients.value);
  },
  { deep: true }
);
</script>
