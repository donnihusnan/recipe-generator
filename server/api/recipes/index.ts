export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const selectedIngredients: string[] = body.ingredients;

  const recipes = await import('@/server/db/recipes.json').then(
    (m) => m.default
  );

  const matchingRecipes = recipes.filter((recipe) =>
    recipe.ingredients.some((ingredient) =>
      selectedIngredients.includes(ingredient)
    )
  );

  return matchingRecipes;
});
