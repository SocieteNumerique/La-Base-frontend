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
    // TODO after success, also redirects to "/" :(
  } else {
    router.push("/")
  }
}
</script>
