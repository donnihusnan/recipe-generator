<template>
  <div class="flex flex-wrap gap-4">
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
      >{{ ingredient }}</input>
    </label>
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

const localSelectedIngredients = ref<string[]>(props.modelValue ?? []);

watch(localSelectedIngredients, (newVal) => {
  emits('update:modelValue', newVal);
});


</script>
