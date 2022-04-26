<template>
  <NuxtLayout name="default">
    <template #header>
      <h1>Nouvelle fiche ressource</h1>
      <div class="fr-mb-14w"/>
    </template>

    <div class="fr-col-3 fr-pr-3w">
      <ResourceCreationLeftMenu/>
    </div>

    <div class="fr-col-6 fr-pr-3w">
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
