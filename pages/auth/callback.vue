<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase';

const supabase = useSupabase();

onMounted(async () => {
  try {
    // Handle the OAuth callback
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('OAuth callback error:', error);
      await navigateTo('/auth/login?error=oauth_error');
      return;
    }

    if (data.session) {
      // Successfully authenticated, redirect to home
      await navigateTo('/');
    } else {
      // No session found, redirect to login
      await navigateTo('/auth/login');
    }
  } catch (error) {
    console.error('Callback processing error:', error);
    await navigateTo('/auth/login?error=callback_error');
  }
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100"
  >
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
      ></div>
      <p class="text-gray-600">Completing sign in...</p>
    </div>
  </div>
</template>
