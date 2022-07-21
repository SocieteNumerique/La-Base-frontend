<template>
  <label class="fr-label fr-pt-3w">Licence et accès</label>
  <p class="fr-hint-text">
    Si cet élément dispose d’accès ou d’une licence qui lui sont spécifique
    merci de le renseigner.
  </p>
  <DsfrCheckbox
    v-model="content.useResourceLicense"
    label="Utiliser les conditions d'accès générales de la ressource"
    name="use-resource-licence"
    @update="updateCheckbox"
  />
  <DsfrButton
    :disabled="content.useResourceLicense"
    secondary
    @click="isEditingLicense = true"
  >
    Renseigner licence et accès
  </DsfrButton>
  <template v-if="isEditingLicense">
    <TagLicenseExit
      v-if="isExiting"
      @back="isExiting = false"
      @close="resetAndExit"
    />
    <template v-else>
      <TagLicenseGeneral
        v-if="step === 'radio'"
        v-model="tags"
        :full-tags="fullTags"
        @next="step = 'details'"
        @close="isExiting = true"
      />
      <template v-if="step === 'details'">
        <TagLicenseDetailsFree
          v-if="isFreeLicense"
          v-model="tags"
          :full-tags="fullTags"
          @next="step = 'access'"
          @close="isExiting = true"
          @previous="step = 'radio'"
        />
        <TagLicenseDetailsText
          v-else
          v-model:tags="tags"
          v-model:license-text="licenseText"
          :full-tags="fullTags"
          :proprietary="isProprietaryLicense"
          @update:license-text="licenseText = $event"
          @next="step = 'access'"
          @close="isExiting = true"
          @previous="step = 'radio'"
        />
      </template>
      <TagLicenseAccess
        v-if="step === 'access'"
        v-model="tags"
        :full-tags="fullTags"
        @save="save"
        @close="isExiting = true"
        @previous="step = 'details'"
      />
    </template>
  </template>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { Content, LicenseText, Tag } from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"

const tagStore = useTagStore()

const props = defineProps({
  modelValue: { type: Object as PropType<Content>, required: true },
})
const emits = defineEmits(["close", "update:model-value"])

const step = ref<"radio" | "details" | "access">("radio")
const isExiting = ref<boolean>(false)
const isEditingLicense = ref<boolean>(false)

const tags = ref<number[]>([])
const content = useModel("modelValue", { type: "object" })
const licenseText = ref<LicenseText>({})
resetData()

const isFreeLicense = computed(() =>
  tags.value?.includes(tagStore.tagIdsBySlug["main_00free"]!)
)
const isProprietaryLicense = computed(() =>
  tags.value?.includes(tagStore.tagIdsBySlug["main_01proprietary"]!)
)
const fullTags = computed<Tag[]>(() =>
  tags.value.map((id) => tagStore.tagsById[id])
)

function updateCheckbox(value: boolean) {
  emits("update:model-value", {
    ...props.modelValue,
    useResourceLicense: value,
  })
}
function save() {
  emits("update:model-value", {
    ...props.modelValue,
    tags: tags.value,
    licenseText: isFreeLicense.value ? undefined : licenseText.value,
  })
  resetAndExit()
}

function resetData() {
  tags.value = props.modelValue.tags || []
  licenseText.value = props.modelValue.licenseText || {}
  step.value = "radio"
  isExiting.value = false
}
function resetAndExit() {
  resetData()
  isEditingLicense.value = false
}
</script>

<style scoped lang="sass"></style>
