<script setup lang="ts">
const counter = useState("counter");
console.log("### counter", counter.value);
console.log("### counter after increment", counter.value);
const bases = useState("bases");
</script>

<template>
    <h1 class="fr-mt-4w">Accueil</h1>
    <h2 class="fr-mt-5w">second titre</h2>
    <p>compteur : {{ counter }}</p>
    <h2 class="fr-mt-5w">Bases</h2>
    <pre>{{ bases }}</pre>
</template>
