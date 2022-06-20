<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    :title="modalTitle"
    @close="$emit('close')"
  >
    <div class="base-form-container">
      <DsfrInput
        id="baseTitle"
        v-model="base.title"
        :label-visible="true"
        autofocus
        hint="max 100 caractères"
        label="Nom de la base"
        maxlength="100"
        required="true"
      />
      <DsfrInput
        v-model="base.description"
        :is-textarea="true"
        :label-visible="true"
        :required="true"
        hint="max 560 caractères"
        label="Présentation de la base"
        placeholder="Description de la base"
      />
      <DsfrInput
        v-model="base.contact"
        :label-visible="true"
        label="Contact"
        maxlength="100"
        required="true"
      />
      <!-- <DsfrRadioButtonSet
        v-model="base.contactStatus"
        :inline="true"
        :label-visible="true"
        :options="contactStatusOptions"
        label="Le contact est :"
      />-->
      <TagSelector
        v-if="tagStore.categoryBySlug(participantTypeCategoryName)"
        :category="tagStore.categoryBySlug(participantTypeCategoryName)"
        :is-focused="focusedCategory === participantTypeCategoryName"
        :init-tags="base.participantTypeTags"
        source="own"
        @blur="focusCategory('')"
        @change="actorTags = $event"
        @focus="focusCategory(participantTypeCategoryName)"
      />
      <TagSelector
        v-if="tagStore.categoryBySlug(territoryCategoryName)"
        :category="tagStore.categoryBySlug(territoryCategoryName)"
        :is-focused="focusedCategory === territoryCategoryName"
        :init-tags="base.territoryTags"
        source="own"
        @blur="focusCategory('')"
        @change="territoryTags = $event"
        @focus="focusCategory(territoryCategoryName)"
      />
      <!--    profil -->
      <!--    cover -->
    </div>
  </DsfrModal>
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { Base, BaseCreate, Tag } from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"

const baseStore = useBaseStore()
const tagStore = useTagStore()

const emits = defineEmits(["close", "save"])
const props = defineProps({
  new: { type: Boolean, default: false },
})

const modalTitle = props.new
  ? "Création d'une base"
  : "Les informations de la base"

const base = ref<Base | BaseCreate>(
  props.new
    ? {
        title: "",
        description: "",
        contact: "",
        tags: [],
      }
    : { ...baseStore.current }
)

const participantTypeCategoryName = "general_00participantType"
const territoryCategoryName = "territory_00city"
const actorTags = ref<Tag[]>([])
const territoryTags = ref<Tag[]>([])
const focusedCategory = ref("")
const focusCategory = (categoryName: string) => {
  focusedCategory.value = categoryName
}

/*const contactStatusOptions = [
  {
    label: "Public",
    value: "public",
  },
  {
    label: "Privé",
    value: "private",
  },
]*/

async function updateBase() {
  emits("save", {
    ...base.value,
    tags: [
      ...actorTags.value.map((tag) => tag.id),
      ...territoryTags.value.map((tag) => tag.id),
    ],
  })
}

async function createBase() {
  const { error } = await baseStore.createBase(base.value)
  if (!error.value) emits("close")
}

const isNotValid = computed<boolean>(
  () => !(base.value.title && base.value.description && base.value.contact)
)

const actions = computed(() => [
  {
    label: "Valider",
    onClick: props.new ? createBase : updateBase,
    disabled: isNotValid.value,
  },
  {
    label: "Annuler",
    secondary: true,
    onClick: () => emits("close"),
  },
])

onMounted(() => {
  setTimeout(() => {
    const el = document.getElementById("baseTitle")
    if (el) {
      el.focus()
    }
  }, 200)
})
</script>

<style lang="sass">
.base-form-container
  label
    margin-top: 24px

  textarea
    height: 8.5em
</style>
