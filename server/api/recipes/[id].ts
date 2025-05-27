export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const recipes = await import('@/server/db/recipes.json').then(
    (m) => m.default
  );

  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    throw createError({
      statusCode: 404,
      message: `Recipe with id ${id} not found`,
    });
  }
  return recipe;
});
