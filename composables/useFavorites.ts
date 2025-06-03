// composables/useFavorites.ts
export const useFavorites = () => {
  const favorites = ref<any[]>([]);

  // Load favorites from localStorage
  const loadFavorites = () => {
    if (process.client) {
      const stored = localStorage.getItem('favorites');
      if (stored) {
        favorites.value = JSON.parse(stored);
      }
    }
  };

  // Save favorites to localStorage
  const saveFavorites = () => {
    if (process.client) {
      localStorage.setItem('favorites', JSON.stringify(favorites.value));
    }
  };

  // Add to favorites
  const addToFavorites = (recipe: any) => {
    if (!favorites.value.some((r) => r.id === recipe.id)) {
      favorites.value.push(recipe);
      saveFavorites();
    }
  };

  // Remove from favorites
  const removeFromFavorites = (recipe: any) => {
    favorites.value = favorites.value.filter((r) => r.id !== recipe.id);
    saveFavorites();
  };

  // Check if recipe is favorite
  const isFavorite = (recipe: any) => {
    return favorites.value.some((r) => r.id === recipe.id);
  };

  // Initialize on mount
  onMounted(() => {
    loadFavorites();
  });

  return {
    favorites: readonly(favorites),
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loadFavorites,
  };
};
