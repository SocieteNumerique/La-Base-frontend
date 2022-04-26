<template>
  <NuxtLayout name="default">
    <template #header>
      <h1>Nouvelle resource</h1>
      <div class="fr-mb-14w"/>
    </template>

    <div class="fr-col-2">
      <h4 class="fr-text-title--blue-france">Pour commencer</h4>
      <div class="fr-text--xs">Nous avons besoin de quelques informations essentielles pour créer la ressource.</div>
    </div>

    <template v-if="step === 0">
      <ChooseBase @base-chosen="(base) => resource.base = base" />

    </template>
    <template v-else-if="step === 1">
      <div class="fr-col-6 fr-col-offset-1">
        <h6>Informations générales</h6>

        <h6>Contenu</h6>
      </div>

      <div class="fr-col-3">Vérification des doublons</div>
    </template>

  </NuxtLayout>
</template>

<script lang="ts" setup>
import { Resource } from "~/composables/types"

definePageMeta({
  layout: false,
  title: "Nouvelle resource",
})

const step = ref<number>(0)
const resource = ref<Resource>({})
</script>
