<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { getCurrentSession } = useAuth();

onMounted(async () => {
  try {
    await getCurrentSession();

    if (window.location.hash) {
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, '', cleanUrl);
    }

    await navigateTo('/', { replace: true });
  } catch (error) {
    console.error('Auth callback error:', error);
    await navigateTo('/auth/login', { replace: true });
  }
});
</script>
