// plugins/auth.client.ts
import { useAuth } from '~/composables/useAuth';

export default defineNuxtPlugin(async () => {
  const { initialize, initialized, isAuthenticated } = useAuth();

  // Initialize auth only if not already initialized
  await initialize();

  // Wait for initialization and then handle routing
  if (process.client) {
    watch(
      initialized,
      (isInit) => {
        if (isInit) {
          const currentPath = window.location.pathname;
          const isAuthPage = currentPath.startsWith('/auth/');
          const isAuthenticatedUser = isAuthenticated.value;

          if (isAuthenticatedUser && isAuthPage) {
            navigateTo('/', { replace: true });
          }
          // Redirect unauthenticated users to login (except for public pages)
          else if (
            !isAuthenticatedUser &&
            !isAuthPage &&
            currentPath !== '/' &&
            !currentPath.startsWith('/public/')
          ) {
            navigateTo('/auth/login', { replace: true });
          }
        }
      },
      { immediate: true }
    );
  }
});
