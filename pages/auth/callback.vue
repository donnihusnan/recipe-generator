<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { getCurrentSession } = useAuth();

onMounted(async () => {
  try {
    await getCurrentSession();

    // ✅ Bersihkan hash token dari URL agar tidak muncul di address bar
    if (window.location.hash) {
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, '', cleanUrl);
    }

    // Redirect ke halaman utama
    await navigateTo('/', { replace: true });
  } catch (error) {
    console.error('Auth callback error:', error);
    // Redirect ke login jika gagal
    await navigateTo('/auth/login', { replace: true });
  }
});
</script>
