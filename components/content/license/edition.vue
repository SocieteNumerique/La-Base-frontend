<template>
  <label class="fr-label fr-pt-3w">Licence et accès</label>
  <p class="fr-hint-text">
    Si cet élément dispose d’accès ou d’une licence qui lui sont spécifique
    merci de le renseigner.
  </p>
  <DsfrCheckbox
    v-model="content.useResourceLicenseAndAccess"
    label="Utiliser les conditions d'accès générales de la ressource"
    name="use-resource-licence"
    @update="updateCheckbox"
  />
  <DsfrButton
    :disabled="content.useResourceLicenseAndAccess"
    secondary
    @click="isEditingLicense = true"
  >
    {{ hasSpecificLicenceData ? "Modifier" : "Renseigner" }} licence et accès
  </DsfrButton>
  <template v-if="isEditingLicense">
    <ContentLicenseExit
      v-if="isExiting"
      @back="isExiting = false"
      @close="resetAndExit"
    />
    <template v-else>
      <ContentLicenseGeneralAccess
        v-if="step === 'general'"
        v-model="tags"
        v-model:license-knowledge="content.licenseKnowledge"
        :full-tags="fullTags"
        @next="step = 'details'"
        @close="isExiting = true"
        @save="save"
      />
      <ContentLicenseDetails
        v-if="step === 'details'"
        v-model:tags="tags"
        v-model:license-text="licenseText"
        :full-tags="fullTags"
        :license-type="licenseType"
        @update:license-text="licenseText = $event"
        @save="save"
        @close="isExiting = true"
        @previous="step = 'general'"
      />
    </template>
  </template>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { Content, LicenseText, Tag } from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"
import { licenseTagBySlug } from "~/composables/licenseUtils"

const tagStore = useTagStore()

const props = defineProps({
  modelValue: { type: Object as PropType<Content>, required: true },
})
const emits = defineEmits(["close", "update:model-value"])

const step = ref<"general" | "details">("general")
const isExiting = ref<boolean>(false)
const isEditingLicense = ref<boolean>(false)

const tags = ref<number[]>([])
const content = useModel<Content>("modelValue", { type: "object" })
const licenseText = ref<LicenseText>({})
resetData()

const licenseType = computed(() => {
  for (const [slug, licenseType] of Object.entries(licenseTagBySlug)) {
    if (tags.value?.includes(tagStore.tagIdsBySlug[slug]!)) return licenseType
  }
})

const fullTags = computed<Tag[]>(() =>
  tags.value.map((id) => tagStore.tagsById[id])
)
const hasSpecificLicenceData = computed<boolean>(
  () => !!content.value?.tags?.length
)

function updateCheckbox(value: boolean) {
  emits("update:model-value", {
    ...props.modelValue,
    useResourceLicenseAndAccess: value,
  })
}

function save() {
  emits("update:model-value", {
    ...props.modelValue,
    tags: tags.value,
    licenseText: licenseType.value === "free" ? undefined : licenseText.value,
  })
  resetAndExit()
}

function resetData() {
  tags.value = props.modelValue.tags || []
  licenseText.value = props.modelValue.licenseText || {}
  step.value = "general"
  isExiting.value = false
}

function resetAndExit() {
  resetData()
  isEditingLicense.value = false
}
</script>

<style scoped lang="sass"></style>
