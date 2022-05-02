<template>
  <div>
    <ResourceCreationModal v-if="showModal" @close="showModal = false" />
    <DsfrButton label="Ajouter une ressource" @click="onButtonClick" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "resource",
  title: "Nouvelle fiche ressource",
})

let showModal = ref(false)
const onButtonClick = () => {
  console.log("### show modal")
  showModal.value = true
}
</script>
