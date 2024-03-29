<template>
  <div>
    <DsfrRadioButtonSet
      v-model="radioValue"
      name="resourceStatus"
      :inline="true"
      :options="options"
      :required="true"
      legend="Le statut de la ressource est"
      class="fr-mb-2w fr-mt-11v"
      @update:model-value="onChange"
    />
    <p class="fr-mb-4w">{{ stateHint }}</p>
    <div v-if="radioValue === 'private'" class="fr-mb-4w">
      <UserSelector
        v-model="resourceStore.current.authorizedUsers"
        label="Autoriser uniquement ces utilisateurs à consulter cette ressource"
      />
      <UserList
        :users="resourceStore.current.authorizedUsers"
        @remove="removeUserId"
      />

      <TagSelector
        v-if="tagStore.categoryBySlug(participantTypeCategoryName)"
        :category="tagStore.categoryBySlug(participantTypeCategoryName)"
        :init-tags="resourceStore.current.authorizedUserTags"
        :is-focused="focusedCategory === participantTypeCategoryName"
        label="Autoriser pour une typologie d’acteurs"
        source="own"
        mode="filter"
        @blur="focusCategory('')"
        @change="authorizedUserTags = $event"
        @focus="focusCategory(participantTypeCategoryName)"
      />
    </div>
    <div v-if="!canGoPublicOnMounted">
      <div v-if="!canGoPublic" class="fr-alert fr-alert--info">
        <p class="fr-alert__title">
          La ressource ne peut être publiée publiquement
        </p>
        <p>
          Pour passer la ressource en public, il manque les informations
          suivantes :
        </p>
      </div>
      <div v-else class="fr-alert fr-alert--success">
        <p class="fr-alert__title">La ressource peut maintenant être publiée</p>
      </div>

      <div class="fr-mt-3w"></div>

      <TagSelector
        v-for="category in missingCategoriesToGoPublicOnMounted"
        :key="category.id"
        :is-focused="focusedCategory === category.name"
        :category="category"
        @focus="focusCategory(category.name)"
        @blur="focusCategory('')"
      />

      <div v-if="!resourceStore.current.description">
        <div class="fr-alert fr-alert--warning fr-alert--sm">
          <p class="fr-alert__title">
            La description de la ressource doit être ajoutée dans l'onglet
            "Informations" > "Général"
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { computed, onMounted } from "vue"
import { useTagStore } from "~/stores/tagStore"
import { Tag, TagCategory, User } from "~/composables/types"
import { participantTypeCategoryName } from "~/composables/strUtils"

const resourceStore = useResourceStore()
const tagStore = useTagStore()

const focusedCategory = ref("")

const focusCategory = (categoryName: string) => {
  focusedCategory.value = categoryName
}

const authorizedUserTags = ref<Tag[]>(
  (resourceStore.current.authorizedUserTags || [])?.map(
    (id: number) => tagStore.tagsById[id]
  ) || []
)
watch(authorizedUserTags, () => {
  resourceStore.current.authorizedUserTags = authorizedUserTags.value.map(
    (tag) => tag.id
  )
})

const removeUserId = (userId: number) => {
  resourceStore.current.authorizedUsers = (
    resourceStore.current.authorizedUsers || []
  ).filter((user: User) => user.id !== userId)
}

const radioValue = ref("")
let missingCategoriesToGoPublicOnMounted = ref<TagCategory[]>([])
let canGoPublicOnMounted = ref(true)

const hintByState: { [key: string]: string } = {
  public:
    "La ressource peut être consultée par tous les visiteurs, qu’ils disposent ou non d’un compte utilisateur. Elle ne peut cependant être modifiée que par les administrateurs de la base sur laquelle elle a été publiée.",
  private:
    "Cette fiche ressource n’est accessible qu’aux administrateurs et contributeurs de votre base, ainsi qu’à un nombre réduit d’autres utilisateurs, sélectionnés par vous.",
  draft:
    "Cette ressource est au format “brouillon”. Elle n’est accessible que par les administrateurs et contributeurs de votre base et apparaitra dans l’onglet “Brouillons” de votre base.",
}
const stateHint = computed<string>(
  () => hintByState[resourceStore?.current?.state] || ""
)

onMounted(() => {
  if (!resourceStore.current) {
    return
  }
  radioValue.value = resourceStore.current.state
  canGoPublicOnMounted.value = canGoPublic.value
  missingCategoriesToGoPublicOnMounted.value = missingCategoriesToGoPublic.value
})

const licenseTypeCategoryId = tagStore.categoryBySlug("license_01license")?.id
const missingCategoriesToGoPublic = computed((): TagCategory[] => {
  const toReturn: TagCategory[] = []
  for (const category of tagStore.categories) {
    if (
      category.relatesTo?.indexOf("Resource") === -1 ||
      !category.requiredToBePublic
    )
      continue
    if (
      category.id === licenseTypeCategoryId &&
      !resourceStore.current.hasGlobalLicense
    )
      continue // allow no license if license is meant to be content-specific

    // check if we have selected at least a tag in this category
    let skipCategory = false
    for (const selectedTagId of resourceStore.current.tags!) {
      if (category.tags.indexOf(selectedTagId) !== -1) {
        skipCategory = true
        break
      }
    }
    if (!skipCategory) {
      toReturn.push(category)
    }
  }
  return toReturn
})

const canGoPublic = computed(
  () =>
    missingCategoriesToGoPublic.value.length === 0 &&
    !!resourceStore.current.description
)

const options = computed(() => {
  canGoPublic.value
  return [
    {
      label: "Public",
      value: "public",
      disabled: !canGoPublic.value,
    },
    {
      label: "Privé",
      value: "private",
    },
    {
      label: "Brouillon",
      value: "draft",
    },
  ]
})
const onChange = (newValue: string) => {
  radioValue.value = newValue
  resourceStore.resourcesById[resourceStore.currentId!].state = newValue
  resourceStore.markDirty()
}
</script>
