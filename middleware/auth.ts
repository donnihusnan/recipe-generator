// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, initialized } = useAuth();

  // Wait for auth to be initialized
  if (!initialized.value) {
    // You might want to show a loading state here
    return;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated.value) {
    return navigateTo('/auth/login');
  }
});
