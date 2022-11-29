<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    :title="modalTitle"
    @close="$emit('close')"
  >
    <div class="base-form-container">
      <DsfrInputGroup
        id="baseTitle"
        v-model="v$.title.$model"
        :error-message="validationMessageFromErrors(v$.title.$errors)"
        :is-invalid="v$.title.$error"
        :label-visible="true"
        autofocus
        hint="max 100 caractères"
        label="Nom de la base"
        maxlength="100"
        required="true"
      />

      <FormRichTextInputGroup
        v-model="v$.description.$model"
        :toolbar-options="toolbarOptions"
        :is-invalid="v$.description.$error"
        :error-message="validationMessageFromErrors(v$.description.$errors)"
        label="Présentation de la base"
        :required="true"
      />

      <DsfrInputGroup
        v-model="v$.contact.$model"
        :error-message="validationMessageFromErrors(v$.contact.$errors)"
        :is-invalid="v$.contact.$error"
        :label-visible="true"
        label="Courriel de contact"
        maxlength="100"
        required="true"
      />
      <template v-if="props.new">
        <label class="fr-label" for="new-base-from-header-state">
          Le statut de la base est<span class="required">&nbsp;*</span>
        </label>
        <DsfrRadioButtonSet
          id="new-base-from-header-state"
          v-model="v$.state.$model"
          :error-message="validationMessageFromErrors(v$.state.$errors)"
          :is-invalid="v$.state.$error"
          :inline="true"
          :options="baseStateOptions"
          :required="true"
          label="Le statut de la base est"
          name="baseState"
          class="fr-mb-0"
          @change="onStateChange"
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
                v-model="v$.contactState.$model"
                :error-message="
                  validationMessageFromErrors(v$.contactState.$errors)
                "
                :is-invalid="v$.contactState.$error"
                type="radio"
                name="contact-state"
                value="public"
                :disabled="v$.state.$model === 'private'"
              />
              <label class="fr-label" for="contact-state-public">Public</label>
            </div>
            <div class="fr-radio-group">
              <input
                id="contact-state-private"
                v-model="v$.contactState.$model"
                :error-message="
                  validationMessageFromErrors(v$.contactState.$errors)
                "
                :is-invalid="v$.contactState.$error"
                type="radio"
                name="contact-state"
                value="private"
                :disabled="v$.state.$model === 'private'"
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
      <DsfrInputGroup
        v-model="v$.website.$model"
        :error-message="validationMessageFromErrors(v$.website.$errors)"
        :is-invalid="v$.website.$error"
        :label-visible="true"
        label="Site web"
        placeholder="https://monsite.fr"
        maxlength="200"
        :required="false"
      />
      <DsfrInputGroup
        v-model="v$.nationalCartographyWebsite.$model"
        :error-message="
          validationMessageFromErrors(v$.nationalCartographyWebsite.$errors)
        "
        :is-invalid="v$.nationalCartographyWebsite.$error"
        :label-visible="true"
        label="Lien de votre fiche sur la cartographie nationale"
        placeholder="https://www.cartographie.societenumerique.gouv.fr/"
        maxlength="200"
        :required="false"
      />
      <a
        href="https://sonum.tlscp.fr/fr/dispositif/cartographie-nationale/"
        target="_blank"
        class="no-underline"
        style="
          display: inline-block;
          margin-top: -20px;
          color: var(--text-action-high-blue-france);
        "
      >
        Plus d’informations sur la cartographie nationale
      </a>

      <template v-if="props.new">
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
      </template>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-sm-6">
          <DsfrInputGroup
            v-model="v$.socialMediaLinkedin.$model"
            :error-message="
              validationMessageFromErrors(v$.socialMediaLinkedin.$errors)
            "
            :is-invalid="v$.socialMediaLinkedin.$error"
            :label-visible="true"
            label="Lien page LinkedIn"
            placeholder="https://"
            maxlength="200"
            :required="false"
          />
          <DsfrInputGroup
            v-model="v$.socialMediaFacebook.$model"
            :error-message="
              validationMessageFromErrors(v$.socialMediaFacebook.$errors)
            "
            :is-invalid="v$.socialMediaFacebook.$error"
            :label-visible="true"
            label="Lien page Facebook"
            placeholder="https://"
            maxlength="200"
            :required="false"
          />
        </div>
        <div class="fr-col-sm-6">
          <DsfrInputGroup
            v-model="v$.socialMediaTwitter.$model"
            :error-message="
              validationMessageFromErrors(v$.socialMediaTwitter.$errors)
            "
            :is-invalid="v$.socialMediaTwitter.$error"
            :label-visible="true"
            label="Lien page Twitter"
            placeholder="https://"
            maxlength="200"
            :required="false"
          />
          <DsfrInputGroup
            v-model="v$.socialMediaMastodon.$model"
            :error-message="
              validationMessageFromErrors(v$.socialMediaMastodon.$errors)
            "
            :is-invalid="v$.socialMediaMastodon.$error"
            :label-visible="true"
            label="Lien page Mastodon"
            placeholder="https://"
            maxlength="200"
            :required="false"
          />
        </div>
      </div>
    </div>
  </DsfrModal>
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import {
  Base,
  BaseCreate,
  OtherRichTextActions,
  RichTextToolbarOptions,
  Tag,
} from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"
import { useUserStore } from "~/stores/userStore"
import {
  participantTypeCategoryName,
  territoryCategoryName,
} from "~/composables/strUtils"
import { computed, reactive } from "vue"
import { email, minLength, required, url } from "@vuelidate/validators"
import useVuelidate, { ValidationRuleWithParams } from "@vuelidate/core"
import { useRoute } from "vue-router"
import { validationMessageFromErrors } from "~/composables/validation"
import { DsfrButton } from "@gouvminint/vue-dsfr"

const baseStore = useBaseStore()
const tagStore = useTagStore()
const userStore = useUserStore()
const route = useRoute()

const baseId = parseInt(<string>route.params.id)
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

const toolbarOptions: RichTextToolbarOptions = {
  show: [
    OtherRichTextActions.BOLD,
    OtherRichTextActions.ITALIC,
    OtherRichTextActions.LIST_ORDERED,
    OtherRichTextActions.LIST_UNORDERED,
    OtherRichTextActions.LINK,
    OtherRichTextActions.LINK_UNLINK,
  ],
}

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
  ...userDataState,
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

const actions = computed(() => [
  {
    label: "Valider",
    onClick: props.new ? createBase : updateBase,
    disabled: !v$.value.$invalid,
  },
  {
    label: "Annuler",
    secondary: true,
    onClick: () => emits("close"),
  },
])
const isOfWebsite = (baseUrl: string) => {
  return (input: string) =>
    input.startsWith(`https://www.${baseUrl}`) ||
    input.startsWith(`https://${baseUrl}`)
}
const isNationalCartographyWebsite = isOfWebsite(
  "cartographie.societenumerique.gouv.fr"
)
const isLinkedinUrl = isOfWebsite("linkedin.com")
const isFacebookUrl = isOfWebsite("facebook.com")
const isTwitterUrl = isOfWebsite("twitter.com")

// form validation
const userDataState = reactive(
  props.new
    ? {
        socialMediaFacebook: "",
        socialMediaTwitter: "",
        socialMediaMastodon: "",
        socialMediaLinkedin: "",
        nationalCartographyWebsite: "",
        website: "",
        title: "",
        description: "",
        contact: userStore.email,
        state: "private",
        contactState: "",
      }
    : {
        socialMediaFacebook: baseStore.basesById[baseId].socialMediaFacebook,
        socialMediaTwitter: baseStore.basesById[baseId].socialMediaTwitter,
        socialMediaMastodon: baseStore.basesById[baseId].socialMediaMastodon,
        socialMediaLinkedin: baseStore.basesById[baseId].socialMediaLinkedin,
        nationalCartographyWebsite:
          baseStore.basesById[baseId].nationalCartographyWebsite,
        website: baseStore.basesById[baseId].website,

        title: baseStore.basesById[baseId].title,
        description: baseStore.basesById[baseId].description,
        contact: baseStore.basesById[baseId].contact,
        state: baseStore.basesById[baseId].state,
        contactState: baseStore.basesById[baseId].contactState,
      }
)

const getRichTextContent = (input: string): string =>
  input.replace(/<[^>]*>?/gm, "")

const richTextMinValidator = (min: number): ValidationRuleWithParams => {
  return {
    $validator(input: any) {
      return getRichTextContent(input).length >= min
    },
    $message: () => "",
    $params: { min },
  }
}
const userDataRules = {
  socialMediaFacebook: { isFacebookUrl },
  socialMediaTwitter: { isTwitterUrl },
  socialMediaMastodon: { url },
  socialMediaLinkedin: { isLinkedinUrl },
  nationalCartographyWebsite: { isNationalCartographyWebsite },
  website: { url },
  title: { required, minLength: minLength(3) },
  description: {
    minLength: richTextMinValidator(3),
  },
  contact: { required, email },
  state: {},
  contactState: {},
}
const v$ = useVuelidate(userDataRules, userDataState)

const descriptionContent = computed({
  get() {
    return {
      text: v$.value.description.$model,
    }
  },
  set(newValue: any) {
    v$.value.description.$model = newValue.text
  },
})

onMounted(() => {
  setTimeout(() => {
    const el = document.getElementById("baseTitle")
    if (el) {
      el.focus()
    }
  }, 200)
})

const onStateChange = (ev: any) => {
  v$.value.contactState.$model = ev.target.value
}
</script>

<style lang="sass">
.base-form-container
  label, label.search
    margin-top: 24px

  textarea
    height: 8.5em
</style>
