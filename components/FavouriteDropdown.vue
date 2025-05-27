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
    type: 'label' as const,
    target: `/favorites`,
  },
  ...favorites.map((r: Recipe) => ({
    label: r.title,
    to: `/recipes/${r.id}`,
  })),
]);
</script>

<template>
  <UTooltip text="No favorites yet" v-if="!favorites || favorites.length === 0">
    <UDropdownMenu :items="items" :disabled="true">
      <UButton icon="i-lucide-book-heart" color="neutral" variant="outline" />
    </UDropdownMenu>
  </UTooltip>

  <UDropdownMenu v-else class="cursor-pointer" :items="items">
    <UButton icon="i-lucide-book-heart" color="neutral" variant="outline" />
  </UDropdownMenu>
</template>
