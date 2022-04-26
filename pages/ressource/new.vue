<template>
  <NuxtLayout name="default">
    <template #header>
      <h1>Nouvelle fiche ressource</h1>
      <div class="fr-mb-14w"/>
    </template>

    <div class="fr-col-2">
      <ResourceCreationLeftMenu/>
    </div>

    <div class="fr-col-6 fr-col-offset-1">
      <ResourceCreationMain/>
    </div>

    <div class="fr-col-3">
      <ResourceDuplicatesStatus/>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>

definePageMeta({
  layout: false,
  title: "Nouvelle fiche ressource",
})

</script>
