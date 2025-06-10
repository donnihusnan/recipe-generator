<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { user, signOut } = useAuth();

const handleSignOut = async () => {
  try {
    await signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
</script>

<template>
  <div
    class="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-gray-800 min-h-screen"
  >
    <!-- Enhanced Header -->
    <header class="relative">
      <!-- Background with gradient and pattern -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
      ></div>
      <div class="absolute inset-0 bg-black/10"></div>

      <div class="relative px-6 py-6 flex justify-between items-center">
        <NuxtLink
          to="/"
          class="group flex items-center space-x-3 text-white hover:text-yellow-200 transition-all duration-300"
        >
          <div
            class="bg-white/20 backdrop-blur-sm rounded-xl p-2 group-hover:bg-white/30 transition-all duration-300"
          >
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold">Build Your Recipe</h1>
            <p class="text-white/80 text-sm">Discover amazing dishes</p>
          </div>
        </NuxtLink>

        <nav class="flex items-center space-x-6">
          <template v-if="user">
            <div
              class="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
            >
              <div
                class="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
              >
                <span class="text-white text-sm font-bold">
                  {{
                    (user.user_metadata?.full_name || user.email || '')
                      .charAt(0)
                      .toUpperCase()
                  }}
                </span>
              </div>
              <span class="text-white text-sm font-medium">
                {{ user.user_metadata?.full_name || user.email }}
              </span>
            </div>

            <NuxtLink
              to="/favorites"
              class="group flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm font-medium">Favorites</span>
            </NuxtLink>

            <NuxtLink
              to="/user-recipes"
              class="group flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm font-medium">Your Recipes</span>
            </NuxtLink>

            <NuxtLink
              to="/add-recipe"
              class="group flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm font-medium">Add Recipe</span>
            </NuxtLink>

            <button
              @click="handleSignOut"
              class="group flex items-center space-x-2 bg-red-500/80 backdrop-blur-sm hover:bg-red-600 text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 001-1h10.586l-2.293-2.293a1 1 0 10-1.414 1.414L15.586 5H6a3 3 0 00-3 3v8a3 3 0 003 3h8a3 3 0 003-3V8a1 1 0 10-2 0v8a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1h8.586l-2.293 2.293a1 1 0 101.414 1.414L17.414 7H9a1 1 0 100-2h10.586l-2.293-2.293a1 1 0 10-1.414 1.414L19.586 5H3z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm font-medium">Sign Out</span>
            </button>
          </template>

          <template v-else>
            <NuxtLink
              to="/add-recipe"
              class="group flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm font-medium">Add Recipe</span>
            </NuxtLink>

            <NuxtLink
              to="/auth/login"
              class="group flex items-center space-x-2 bg-white hover:bg-gray-100 text-indigo-600 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3 3a1 1 0 011 1v2h12V4a1 1 0 112 0v12a1 1 0 11-2 0V8H4v8a1 1 0 11-2 0V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Login</span>
            </NuxtLink>
          </template>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <slot />
    </main>
  </div>
</template>
