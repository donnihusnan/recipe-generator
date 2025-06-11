<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { signUp, signInWithOAuth, isLoading, error, clearError } = useAuth();

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
});

const successMessage = ref('');

const isFormValid = computed(() => {
  return (
    form.name.length > 0 &&
    form.email.length > 0 &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword &&
    form.agreeTerms
  );
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    await signUp(form.email, form.password, {
      full_name: form.name,
    });

    successMessage.value =
      'Account created successfully! Please check your email to verify your account.';

    Object.assign(form, {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    });
  } catch (err) {}
};

const signInWithProvider = async (provider: 'google') => {
  try {
    await signInWithOAuth(provider);
  } catch (err) {}
};

onUnmounted(() => {
  clearError();
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div
          class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6"
        >
          <h2 class="text-4xl font-bold mb-2">Join Our Community</h2>
          <p class="text-gray-600 text-lg">
            Create your account and start cooking amazing dishes
          </p>
        </div>
        <p class="mt-4 text-sm text-gray-600">
          Already have an account?
          <NuxtLink
            to="/auth/login"
            class="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Sign in here
          </NuxtLink>
        </p>
      </div>

      <div
        class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div
            v-if="error"
            class="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-r-xl p-4"
          >
            <div class="flex items-center">
              <div class="bg-red-100 rounded-full p-2 mr-3">
                <svg
                  class="w-4 h-4 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <p class="text-red-800 font-medium">{{ error }}</p>
            </div>
          </div>

          <div
            v-if="successMessage"
            class="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-r-xl p-4"
          >
            <div class="flex items-center">
              <div class="bg-green-100 rounded-full p-2 mr-3">
                <svg
                  class="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <p class="text-green-800 font-medium">{{ successMessage }}</p>
            </div>
          </div>

          <div class="space-y-5">
            <div>
              <label
                for="name"
                class="text-sm font-semibold text-gray-800 mb-2 flex items-center"
              >
                <span
                  class="bg-gradient-to-r from-blue-400 to-purple-400 w-1 h-5 rounded-full mr-2"
                ></span>
                Full Name
              </label>
              <input
                id="name"
                v-model="form.name"
                name="name"
                type="text"
                autocomplete="name"
                required
                class="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-white hover:shadow-md text-gray-900 placeholder-gray-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                for="email"
                class="text-sm font-semibold text-gray-800 mb-2 flex items-center"
              >
                <span
                  class="bg-gradient-to-r from-green-400 to-blue-400 w-1 h-5 rounded-full mr-2"
                ></span>
                Email Address
              </label>
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-white hover:shadow-md text-gray-900 placeholder-gray-500"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label
                for="password"
                class="text-sm font-semibold text-gray-800 mb-2 flex items-center"
              >
                <span
                  class="bg-gradient-to-r from-orange-400 to-red-400 w-1 h-5 rounded-full mr-2"
                ></span>
                Password
              </label>
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-white hover:shadow-md text-gray-900 placeholder-gray-500"
                placeholder="Create a strong password"
              />
              <p class="mt-2 text-xs text-gray-500 flex items-center">
                <svg
                  class="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <label
                for="confirmPassword"
                class="text-sm font-semibold text-gray-800 mb-2 flex items-center"
              >
                <span
                  class="bg-gradient-to-r from-pink-400 to-purple-400 w-1 h-5 rounded-full mr-2"
                ></span>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                class="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-white hover:shadow-md text-gray-900 placeholder-gray-500"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div
            class="flex items-start space-x-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100"
          >
            <input
              id="agree-terms"
              v-model="form.agreeTerms"
              name="agree-terms"
              type="checkbox"
              required
              class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all duration-300"
            />
            <label
              for="agree-terms"
              class="text-sm text-gray-700 leading-relaxed"
            >
              I agree to the
              <a
                href="#"
                class="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >Terms of Service</a
              >
              and
              <a
                href="#"
                class="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >Privacy Policy</a
              >
            </label>
          </div>

          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div class="flex items-center justify-center">
              <svg
                v-if="isLoading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              {{ isLoading ? 'Creating Your Account...' : 'Create Account' }}
            </div>
          </button>

          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span
                class="px-4 bg-gradient-to-r from-gray-50 to-blue-50 text-gray-600 font-medium rounded-full"
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
        </form>
      </div>

      <div class="text-center">
        <p class="text-sm text-gray-500">
          By creating an account, you'll be able to save your favorite recipes
          and create your own cooking collection.
        </p>
      </div>
    </div>
  </div>
</template>
