<template>
  <NuxtLayout>
    <NuxtPage :key="$route.path" />
  </NuxtLayout>
</template>

<script setup lang="ts">
// TODO: Remove when https://github.com/vuejs/core/issues/5513 fixed
// cf https://github.com/nuxt/framework/issues/3141#issuecomment-1219741638

// TODO might need to use :key="$route.fullpath", but that would break the
//  search by reloading everytime:/
</script>
