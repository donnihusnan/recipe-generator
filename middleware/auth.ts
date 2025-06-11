// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, initialized } = useAuth();

  if (!initialized.value) {
    return;
  }

  if (!isAuthenticated.value) {
    return navigateTo('/auth/login');
  }
});
