<template>
  <div class="fr-mt-11v">
    <div class="callout">
      <p class="fr-text--bold">
        Rappels sur les conditions de publication des fiches ressources.
      </p>
      <p>
        Si dans le cadre de votre fiche ressource, vous réutilisez des
        ressources produites par d’autres (par exemple, des extraits d’articles
        de Wikipédia), assurez-vous d'avoir vérifié avant publication que
        celles-ci sont mises à disposition sous des licences permettant cette
        réutilisation.
      </p>
    </div>
    <DsfrRadioButtonSet
      v-model="hasGlobalLicense"
      name="has-global-license"
      :inline="true"
      :options="options"
      required
      legend="Est-ce-que les conditions d’accès (prix / licences) sont générales à la fiche ou bien spécifiques à chaque élément ?"
      class="fr-text--regular"
    />
    <template v-if="hasGlobalLicense">
      <TagSelector
        :category="priceTagCategory"
        :is-focused="focusedCategory === priceTagCategory.slug"
        label="Prix"
        @focus="focusCategory(priceTagCategory.slug)"
        @blur="focusCategory('')"
      />
      <TagRadioSelector
        :category="accessTagCategory"
        label="L’accès à la ressource nécessite la création d’un compte utilisateur"
        allows-unknown
      />
      <TagRadioSelector
        :category="licenseTypeCategory"
        :is-focused="focusedCategory === licenseTypeCategory.slug"
        label="Licence de la ressource"
        allows-unknown
        label-unknown="Inconnue"
        @focus="focusCategory(licenseTypeCategory.slug)"
        @blur="focusCategory('')"
      />
      <template v-if="knowsLicenseType">
        <TagGroupedSelector
          v-if="isFreeLicense"
          :category="freeLicenseCategory"
          :is-focused="focusedCategory === freeLicenseCategory.slug"
          label="Licence libre exacte"
          @focus="focusCategory(freeLicenseCategory.slug)"
          @blur="focusCategory('')"
        />
        <template v-else>
          <DsfrInput
            v-if="!isProprietaryLicense"
            :model-value="licenseText.name"
            label="Nom de la licence"
            label-visible
            class="fr-form-group"
            @update:model-value="licenseText = { ...licenseText, name: $event }"
          />
          <!--    TODO show file if it is here-->
          <FormFileUpload
            label="Ajouter le texte de la licence"
            @update:model-value="licenseText = { ...licenseText, file: $event }"
          />
          <FormInputLink
            :model-value="licenseText.link"
            label-visible
            hint="max 50 caractères"
            label="ou lien URL de la licence"
            @update:model-value="licenseText = { ...licenseText, link: $event }"
          />
        </template>
      </template>
    </template>
    <p v-else>
      Vous pouvez renseigner les conditions d’accès individuellement lorsque
      c’est nécessaire, directement sur vos contenus dans la partie Ressource.
    </p>
  </div>
</template>
<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { useTagStore } from "~/stores/tagStore"
import { LicenseText } from "~/composables/types"

const resourceStore = useResourceStore()
const tagStore = useTagStore()

const accessTagCategory = tagStore.categoryBySlug("license_04access")
const priceTagCategory = tagStore.categoryBySlug("license_00price")
const licenseTypeCategory = tagStore.categoryBySlug("license_01license")
const freeLicenseCategory = tagStore.categoryBySlug("license_02free")

const licenseText = computed<LicenseText | null>({
  get: () => resourceStore.current?.licenseText || {},
  set(value) {
    resourceStore.current.licenseText = value
  },
})

const hasGlobalLicense = computed<string | undefined>({
  get() {
    if (resourceStore.current?.hasGlobalLicense === undefined) return
    return resourceStore.current.hasGlobalLicense ? "1" : "0"
  },
  set(value) {
    resourceStore.current.hasGlobalLicense =
      value === undefined ? undefined : !!parseInt(value)
  },
})

const isFreeLicense = computed(() =>
  resourceStore.current.tags?.includes(tagStore.tagIdsBySlug["main_00free"]!)
)
const isProprietaryLicense = computed(() =>
  resourceStore.current.tags?.includes(
    tagStore.tagIdsBySlug["main_01proprietary"]!
  )
)
const knowsLicenseType = computed(() =>
  licenseTypeCategory?.tags.some((tagId) =>
    resourceStore.current?.tags?.includes(tagId)
  )
)

watch(isFreeLicense, () => (licenseText.value = null))
watchEffect(() => resourceStore.markDirty())

const options = [
  {
    label: "Générales",
    value: "1",
  },
  {
    label: "Spécifiques",
    value: "0",
  },
]

const focusedCategory = ref("")
const focusCategory = (categoryName: string) => {
  focusedCategory.value = categoryName
}
</script>

<style lang="sass" scoped>
.fr-form-group
  margin-bottom: 44px
</style>
