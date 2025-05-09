<script lang="ts" setup>
type Recipe = {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
};

const { favorites } = defineProps<{
  favorites: Recipe[];
}>();

const items = computed(() => [
  {
    label: 'Your Favourites',
    slot: 'header',
  },
  ...favorites.map((r: Recipe) => ({
    label: r.title,
    click: '',
  })),
]);
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton icon="i-lucide-menu" color="neutral" variant="outline" />
  </UDropdownMenu>
</template>
