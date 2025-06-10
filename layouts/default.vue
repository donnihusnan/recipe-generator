<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { user, signOut, signInWithOAuth } = useAuth();

const handleSignOut = async () => {
  try {
    await signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
</script>

<template>
  <div class="bg-gradient-to-b from-white to-gray-100 text-gray-800">
    <!-- ✅ Header -->
    <header class="px-6 py-4 border-b flex justify-between items-center">
      <h1 class="text-xl font-bold">Build Your Recipe</h1>

      <div class="flex items-center space-x-4">
        <template v-if="user">
          <span class="text-sm text-gray-600">
            Welcome, {{ user.user_metadata?.full_name || user.email }}!
          </span>

          <NuxtLink
            to="/favorites"
            class="text-blue-600 hover:underline text-sm"
          >
            Favorites
          </NuxtLink>

          <NuxtLink
            to="/add-recipe"
            class="text-blue-600 hover:underline text-sm"
          >
            Add Recipe
          </NuxtLink>

          <button
            @click="handleSignOut"
            class="text-red-600 hover:text-red-800 text-sm"
          >
            Sign Out
          </button>
        </template>

        <template v-else>
          <NuxtLink
            to="/auth/login"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            Login
          </NuxtLink>
        </template>
      </div>
    </header>

    <!-- ✅ Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>
