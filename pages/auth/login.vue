<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const {
  signIn,
  signInWithOAuth,
  isLoading,
  error,
  clearError,
  isAuthenticated,
} = useAuth();

const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;
    clearError();

    await signIn(form.email, form.password);
  } catch (err) {
    console.error('Login error:', err);
  } finally {
    isSubmitting.value = false;
  }
};

const signInWithProvider = async (provider: 'google') => {
  try {
    clearError();
    await signInWithOAuth(provider);
  } catch (err) {
    console.error(`${provider} sign in error:`, err);
  }
};

watch(
  isAuthenticated,
  (authenticated) => {
    if (authenticated) {
      navigateTo('/', { replace: true });
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  clearError();
});
</script>

<template>
  <main class="min-h-screen mx-auto p-8 sm:w-full md:w-full lg:w-[50%]">
    <div class="text-center mb-8">
      <div
        class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4"
      >
        <h1 class="text-4xl font-bold mb-2">Welcome Back</h1>
        <p class="text-gray-600 text-lg">Sign in to access your recipes</p>
      </div>
    </div>

    <div
      class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8"
    >
      <div class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
          <span
            class="bg-gradient-to-r from-orange-400 to-pink-400 w-2 h-8 rounded-full mr-3"
          ></span>
          Sign in to your account
        </h2>
        <p class="text-gray-600">
          Or
          <NuxtLink
            to="/auth/register"
            class="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            create a new account
          </NuxtLink>
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div
          v-if="error"
          class="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-r-xl p-4"
        >
          <p class="text-red-800 font-medium">{{ error }}</p>
        </div>

        <div class="space-y-6">
          <div>
            <label
              for="email"
              class="block text-sm font-semibold text-gray-800 mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              :disabled="isLoading || isSubmitting"
              class="w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 disabled:opacity-50"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-semibold text-gray-800 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              :disabled="isLoading || isSubmitting"
              class="w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 disabled:opacity-50"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              :disabled="isLoading || isSubmitting"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors disabled:opacity-50"
            />
            <label
              for="remember-me"
              class="ml-2 block text-sm text-gray-700 font-medium"
            >
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <NuxtLink
              to="/auth/forgot-password"
              class="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Forgot your password?
            </NuxtLink>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || isSubmitting"
            class="group relative w-full flex justify-center py-3 px-6 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            <span
              v-if="isLoading || isSubmitting"
              class="absolute left-0 inset-y-0 flex items-center pl-3"
            >
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ isLoading || isSubmitting ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span
                class="px-4 bg-white/70 text-gray-500 font-medium rounded-full"
              >
                Or continue with
              </span>
            </div>
          </div>

          <div class="mt-6">
            <button
              type="button"
              :disabled="isLoading"
              @click="signInWithProvider('google')"
              class="w-full inline-flex justify-center items-center py-3 px-6 border border-gray-200 rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-sm font-semibold text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02]"
            >
              <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="text-center">
      <div
        class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200"
      >
        <div class="text-4xl mb-3">👨‍🍳</div>
        <h3 class="text-lg font-bold text-gray-800 mb-1">Ready to cook?</h3>
        <p class="text-gray-600 text-sm">
          Join our community of food lovers and recipe creators
        </p>
      </div>
    </div>
  </main>
</template>
