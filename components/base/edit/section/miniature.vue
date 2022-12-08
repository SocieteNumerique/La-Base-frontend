<template>
  <div v-if="baseSection">
    <div class="fr-mb-2w is-flex is-align-item-center">
      <h2 class="fr-h6 is-flex-grow fr-mb-0">
        {{ baseSection.title }}
      </h2>
      <div>
        <DsfrButton
          icon="ri-close-line"
          class="fr-btn--tertiary-no-outline fr-btn--sm"
          @click="emits('delete')"
          >Supprimer</DsfrButton
        >
        <DsfrButton
          icon="ri-edit-line"
          class="fr-btn--tertiary-no-outline fr-btn--sm"
          @click="emits('edit')"
          >Modifier</DsfrButton
        >
      </div>
    </div>

    <p class="fr-mb-4v">
      {{ baseSection.description }}
    </p>

    <div class="separator fr-my-1w" />
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router"
import { useBaseSectionStore } from "~/stores/baseSectionStore"
import { DsfrButton } from "@gouvminint/vue-dsfr"

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

const emits = defineEmits(["delete", "edit"])

const route = useRoute()
const baseSectionStore = useBaseSectionStore()

const baseId = parseInt(<string>route.params.id)

const baseSection = computed(() => {
  return baseSectionStore.baseSectionsById[props.id]
})

if (!baseSection.value) {
  baseSectionStore.getSection(props.id)
}
</script>

<style lang="sass"></style>
