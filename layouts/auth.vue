<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900">
              Recipe Builder
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <slot />
  </div>
</template>

<script setup>
</script>
