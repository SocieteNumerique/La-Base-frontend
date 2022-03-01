<template>
    <div>
        <h1 class="fr-mt-4w">Accueil</h1>
        <h2 class="fr-mt-5w">second titre</h2>
        <button @click="goToTest" class="button">Go to test</button>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()

const goToTest = () => {
    router.push("login")
}
</script>
