<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';
import { ref } from 'vue';

const { user, signOut } = useAuth();
const isMobileMenuOpen = ref(false);

const handleSignOut = async () => {
  try {
    await signOut();
    isMobileMenuOpen.value = false;
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<template>
  <div
    class="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-gray-800 min-h-screen"
  >
    <header class="relative">
      <div
        class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
      ></div>
      <div class="absolute inset-0 bg-black/10"></div>

      <div class="relative px-4 sm:px-6 py-4 sm:py-6">
        <div class="flex justify-between items-center">
          <NuxtLink
            to="/"
            class="group flex items-center space-x-2 sm:space-x-3 text-white hover:text-yellow-200 transition-all duration-300"
            @click="closeMobileMenu"
          >
            <div
              class="bg-white/20 backdrop-blur-sm rounded-xl p-1.5 sm:p-2 group-hover:bg-white/30 transition-all duration-300"
            >
              <svg
                class="w-6 h-6 sm:w-8 sm:h-8"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                />
              </svg>
            </div>
            <div class="hidden sm:block">
              <h1 class="text-xl sm:text-2xl font-bold">Build Your Recipe</h1>
              <p class="text-white/80 text-xs sm:text-sm">
                Discover amazing dishes
              </p>
            </div>
            <div class="sm:hidden">
              <h1 class="text-lg font-bold">Build Recipe</h1>
            </div>
          </NuxtLink>

          <nav class="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <template v-if="user">
              <div
                class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
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
                <span class="text-white text-sm font-medium max-w-32 truncate">
                  {{ user.user_metadata?.full_name || user.email }}
                </span>
              </div>

              <NuxtLink
                to="/favorites"
                active-class="bg-white/30 ring-2 ring-white/50"
                class="group flex items-center space-x-2 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 bg-white/10 hover:bg-white/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9"
                  />
                </svg>
                <span class="text-sm font-medium">Favorites</span>
              </NuxtLink>

              <NuxtLink
                to="/user-recipes"
                active-class="bg-white/30 ring-2 ring-white/50"
                class="group flex items-center space-x-2 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 bg-white/10 hover:bg-white/20"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm font-medium">Your Recipes</span>
              </NuxtLink>

              <NuxtLink
                to="/add-recipe"
                active-class="bg-white/30 ring-2 ring-white/50"
                class="group flex items-center space-x-2 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 bg-white/10 hover:bg-white/20"
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
                active-class="bg-white/30 ring-2 ring-white/50"
                class="group flex items-center space-x-2 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 bg-white/10 hover:bg-white/20"
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
                active-class="bg-yellow-300 hover:bg-yellow-400 text-indigo-700"
                class="group flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg bg-white hover:bg-gray-100 text-indigo-600"
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

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="lg:hidden bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-xl transition-all duration-300"
          >
            <svg
              v-if="!isMobileMenuOpen"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          v-if="isMobileMenuOpen"
          class="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border-t border-white/20 backdrop-blur-sm z-50"
        >
          <nav class="px-4 py-4 space-y-2">
            <template v-if="user">
              <div
                class="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 mb-4"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
                >
                  <span class="text-white text-sm font-bold">
                    {{
                      (user.user_metadata?.full_name || user.email || '')
                        .charAt(0)
                        .toUpperCase()
                    }}
                  </span>
                </div>
                <div>
                  <p class="text-white font-medium text-sm">
                    {{ user.user_metadata?.full_name || user.email }}
                  </p>
                  <p class="text-white/70 text-xs">Welcome back!</p>
                </div>
              </div>

              <NuxtLink
                to="/favorites"
                @click="closeMobileMenu"
                active-class="bg-white/30 ring-2 ring-white/50"
                class="flex items-center space-x-3 text-white px-4 py-3 rounded-xl transition-all duration-300 bg-white/10 hover:bg-white/20"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-medium">Favorites</span>
              </NuxtLink>

              <NuxtLink
                to="/user-recipes"
                @click="closeMobileMenu"
                active-class="bg-white/30 ring-2 ring-white/50"
                class="flex items-center space-x-3 text-white px-4 py-3 rounded-xl transition-all duration-300 bg-white/10 hover:bg-white/20"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-medium">Your Recipes</span>
              </NuxtLink>

              <NuxtLink
                to="/add-recipe"
                @click="closeMobileMenu"
                active-class="bg-white/30 ring-2 ring-white/50"
                class="flex items-center space-x-3 text-white px-4 py-3 rounded-xl transition-all duration-300 bg-white/10 hover:bg-white/20"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-medium">Add Recipe</span>
              </NuxtLink>

              <button
                @click="handleSignOut"
                class="w-full flex items-center space-x-3 bg-red-500/80 hover:bg-red-600 text-white px-4 py-3 rounded-xl transition-all duration-300"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 001-1h10.586l-2.293-2.293a1 1 0 10-1.414 1.414L15.586 5H6a3 3 0 00-3 3v8a3 3 0 003 3h8a3 3 0 003-3V8a1 1 0 10-2 0v8a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1h8.586l-2.293 2.293a1 1 0 101.414 1.414L17.414 7H9a1 1 0 100-2h10.586l-2.293-2.293a1 1 0 10-1.414 1.414L19.586 5H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-medium">Sign Out</span>
              </button>
            </template>

            <template v-else>
              <NuxtLink
                to="/add-recipe"
                @click="closeMobileMenu"
                active-class="bg-white/30 ring-2 ring-white/50"
                class="flex items-center space-x-3 text-white px-4 py-3 rounded-xl transition-all duration-300 bg-white/10 hover:bg-white/20"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-medium">Add Recipe</span>
              </NuxtLink>

              <NuxtLink
                to="/auth/login"
                @click="closeMobileMenu"
                active-class="bg-yellow-300 text-indigo-700"
                class="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 bg-white text-indigo-600"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
      </div>
    </header>

    <main class="bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <slot />
    </main>
  </div>
</template>
