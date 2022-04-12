<template>
  <NuxtLayout name="default">
    <template #header>
      <h1>Nouvelle ressource</h1>
      <div class="fr-mb-14w"/>
    </template>

    <div class="fr-col-2">
      <h4 class="fr-text-title--blue-france">Pour commencer</h4>
      <div class="fr-text--xs">Nous avons besoin de quelques informations essentielles pour créer la ressource.</div>
    </div>

    <div class="fr-col-6 fr-col-offset-1">
      <h6>Informations générales</h6>

      <h6>Contenu</h6>
    </div>

    <div class="fr-col-3">Vérification des doublons</div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
  title: "Nouvelle ressource",
})
</script>
