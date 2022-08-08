<template>
  <div class="content-edit">
    <h4 class="title fr-h4">Éditer {{ labelType }}</h4>
    <slot />
    <DsfrButtonGroup
      :buttons="buttons"
      :inline="true"
      align="right"
      class="fr-mt-4w"
      size="medium"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: { type: String, required: true },
})

const emits = defineEmits(["exit", "save"])

const labelsByType: { [key: string]: string } = {
  text: "le texte",
  linkedResource: "la ressource liée",
  file: "le fichier",
  link: "le lien",
  section: "la section",
}

const labelType = computed<string>(() => labelsByType[props.type])

const buttons = ref([
  {
    label: "Annuler",
    icon: "ri-close-line",
    secondary: true,
    onClick: () => emits("exit"),
  },
  {
    label: "Valider",
    icon: "ri-check-line",
    onClick: () => {
      emits("save")
    },
  },
])
</script>

<style lang="sass">
.content-edit
  border: 1px solid var(--grey-975)

  .fr-label
    margin-top: 16px
</style>
