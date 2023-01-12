<template>
  <div class="content-edit">
    <h4 class="title fr-h4">Éditer {{ labelType }}</h4>
    <slot />
    <div
      style="display: flex; justify-content: space-between"
      class="fr-mt-4w fr-mb-n2w"
    >
      <div>
        <ContentButtonDeleteContent full secondary @delete="$emit('delete')" />
      </div>
      <DsfrButtonGroup
        :buttons="buttons"
        :inline="true"
        align="right"
        class="fr-btns-group--sm"
        size="large"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: { type: String, required: true },
})

const emits = defineEmits(["exit", "save", "delete"])

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
