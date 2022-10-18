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
      <template v-if="props.new">
        <label class="fr-label" for="new-base-from-header-state">
          Le statut de la base est<span class="required">&nbsp;*</span>
        </label>
        <DsfrRadioButtonSet
          id="new-base-from-header-state"
          v-model="base.state"
          :inline="true"
          :options="baseStateOptions"
          :required="true"
          label="Le statut de la base est"
          name="baseState"
        />
      </template>
      <div class="fr-form-group">
        <fieldset class="fr-fieldset fr-fieldset--inline">
          <legend
            id="radio-inline-legend"
            class="fr-fieldset__legend fr-text--regular fr-mb-n3v"
          >
            <label class="fr-label"> Le contact est :</label>
          </legend>
          <div class="fr-fieldset__content">
            <div class="fr-radio-group">
              <input
                id="contact-state-public"
                v-model="base.contactState"
                type="radio"
                name="contact-state"
                value="public"
                :disabled="base.state === 'private'"
              />
              <label class="fr-label" for="contact-state-public">Public</label>
            </div>
            <div class="fr-radio-group">
              <input
                id="contact-state-private"
                v-model="base.contactState"
                type="radio"
                name="contact-state"
                value="private"
                :disabled="base.state === 'private'"
              />
              <label class="fr-label" for="contact-state-private">Privé</label>
            </div>
          </div>
          <div class="fr-hint-text fr-mt-2w">{{ contactStateHint }}</div>
        </fieldset>
      </div>
      <TagSelector
        v-if="tagStore.categoryBySlug(participantTypeCategoryName)"
        :category="tagStore.categoryBySlug(participantTypeCategoryName)"
        :is-focused="focusedCategory === participantTypeCategoryName"
        :init-tags="base.participantTypeTags"
        source="own"
        @blur="focusCategory('')"
        @change="participantTags = $event"
        @focus="focusCategory(participantTypeCategoryName)"
      />
      <TagSelector
        v-if="tagStore.categoryBySlug(territoryCategoryName)"
        :category="tagStore.categoryBySlug(territoryCategoryName)"
        :is-focused="focusedCategory === territoryCategoryName"
        :init-tags="base.territoryTags"
        source="own"
        label="Localisation"
        @blur="focusCategory('')"
        @change="territoryTags = $event"
        @focus="focusCategory(territoryCategoryName)"
      />
      <ImageResizableUpload
        v-model="base.profileImage"
        :label="`${profileActionWord}image de profil pour la base`"
        crop-circle
        :desired-ratio="1"
      />
      <ImageResizableUpload
        v-model="base.coverImage"
        :label="`${coverActionWord}image de couverture pour la base`"
        :desired-ratio="4.8"
      />
    </div>
  </DsfrModal>
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { Base, BaseCreate, Tag } from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"
import { useUserStore } from "~/stores/userStore"
import {
  participantTypeCategoryName,
  territoryCategoryName,
} from "~/composables/strUtils"
import { computed } from "vue"

const baseStore = useBaseStore()
const tagStore = useTagStore()
const userStore = useUserStore()

const emits = defineEmits(["close", "save", "done"])
const props = defineProps({
  new: { type: Boolean, default: false },
  newStayOnPage: { type: Boolean, default: false },
})

const modalTitle = props.new
  ? "Création d'une base"
  : "Les informations de la base"

const fileActionWord = (attrName: "profileImage" | "coverImage") =>
  base.value[attrName] ? "Ajouter une " : "Changer l'"
const profileActionWord = computed<string>(() => fileActionWord("profileImage"))
const coverActionWord = computed<string>(() => fileActionWord("coverImage"))
const contactStateHint = computed<string>(() =>
  base.value?.contactState === "private"
    ? "Seuls les contributeurs et administrateurs de la base peuvent vous contacter"
    : "Les personnes autorisées à consulter la base peuvent vous contacter"
)

const base = ref<Base | BaseCreate>(
  props.new
    ? {
        title: "",
        description: "",
        contact: userStore.email,
        state: "private",
        tags: [],
      }
    : {
        ...baseStore.current,
      }
)

const participantTags = ref<Tag[]>(
  base.value?.participantTypeTags?.map((id: number) => tagStore.tagsById[id]) ||
    []
)
const territoryTags = ref<Tag[]>(
  base.value?.territoryTags?.map((id: number) => tagStore.tagsById[id]) || []
)
const focusedCategory = ref("")
const focusCategory = (categoryName: string) => {
  focusedCategory.value = categoryName
}

const baseStateOptions = [
  {
    label: "Public",
    value: "public",
  },
  {
    label: "Privé",
    value: "private",
  },
  /*{
      label: "Brouillon",
      value: "draft",
    },*/
]

const baseWithTags = computed(() => ({
  ...base.value,
  tags: [
    ...participantTags.value.map((tag) => tag.id),
    ...territoryTags.value.map((tag) => tag.id),
  ],
}))

async function updateBase() {
  emits("save", baseWithTags.value)
}

async function createBase() {
  const { data, error } = await baseStore.createBase(baseWithTags.value)
  if (!error.value) {
    emits("close")
    if (props.newStayOnPage) return emits("done", data.value!.id)
    useRouter().push(`/base/${data.value!.id}`)
  }
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
  label, label.search
    margin-top: 24px

  textarea
    height: 8.5em
</style>
