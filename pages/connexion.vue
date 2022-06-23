<template>
  <div>
    <AuthLoginForm @close="onLoginClose" @done="onLoginSuccess" />
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

const onLoginClose = () => {
  router.push("/")
}
const onLoginSuccess = () => {
  if (route.query.next) {
    router.push({ path: route.query.next })
  } else {
    router.push("/")
  }
}
</script>
