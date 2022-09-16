<template>
  <div>
    <div class="fr-container fr-mt-4w">
      <div class="fr-grid-row fr-mb-10w">
        <div class="fr-col-3 fr-pr-3w"></div>
        <div class="fr-col-6 fr-pr-3w">
          <h1>{{ userDataState.firstName }} {{ userDataState.lastName }}</h1>
        </div>
      </div>

      <div class="fr-mb-11v">
        <div class="fr-grid-row">
          <div class="fr-col-3 fr-pr-3w">
            <DsfrSideMenu heading-title="" :menu-items="leftMenuItems" />
          </div>

          <div class="fr-col-6 fr-pr-3w">
            <template v-if="activeSlug === 'informations'">
              <div class="">
                <DsfrInputGroup
                  v-model="v$.firstName.$model"
                  :error-message="
                    validationMessageFromErrors(v$.firstName.$errors)
                  "
                  :is-invalid="v$.firstName.$error"
                  :label-visible="true"
                  label="Prénom"
                  style="margin-bottom: 16px"
                />
                <DsfrInputGroup
                  v-model="v$.lastName.$model"
                  :error-message="
                    validationMessageFromErrors(v$.lastName.$errors)
                  "
                  :is-invalid="v$.lastName.$error"
                  :label-visible="true"
                  label="Nom"
                  style="margin-bottom: 16px"
                />
                <DsfrInputGroup
                  v-model="v$.email.$model"
                  :error-message="validationMessageFromErrors(v$.email.$errors)"
                  :is-invalid="v$.email.$error"
                  :label-visible="true"
                  label="Courriel"
                  style="margin-bottom: 16px"
                />
                <TagSelector
                  v-for="category of categories"
                  :key="category.id"
                  :is-focused="focusedCategory === category.slug"
                  :category="category"
                  :init-tags="initialTagsByCategoryId[category.id]"
                  source="own"
                  @focus="focusCategory(category.slug)"
                  @blur="focusCategory('')"
                  @change="(tags) => onTagsChange(category.id, tags)"
                />
              </div>
              <div style="display: flex; justify-content: flex-end">
                <DsfrButton
                  label="Sauvegarder"
                  class=""
                  icon="ri-save-line"
                  :disabled="v$.$invalid"
                  @click="updateUser"
                />
              </div>
            </template>
            <template v-if="activeSlug === 'suppression'">
              <h2>Supprimer le compte utilisateur</h2>
              <DsfrHighlight :text="deleteText" />
              <div style="display: flex; justify-content: flex-end">
                <DsfrButton
                  label="Supprimer"
                  icon="ri-delete-bin-line"
                  class="fr-background-flat--error"
                  @click="showDeleteConfirmation = true"
                />
              </div>
              <DsfrModal
                v-if="showDeleteConfirmation"
                :opened="true"
                :actions="deleteConfirmationActions"
                title="Supprimer le compte utilisateur"
                @close="showDeleteConfirmation = false"
              >
                <p>
                  Confirmez-vous la suppression de votre compte ? Cette
                  opération est irréversible.
                </p>
              </DsfrModal>
            </template>

            <template v-if="activeSlug == 'mot-de-passe'">
              <h2>Modifier le mot de passe</h2>
              <DsfrInputGroup
                v-model="vPass$.oldPassword.$model"
                :error-message="
                  validationMessageFromErrors(vPass$.oldPassword.$errors)
                "
                :is-invalid="vPass$.oldPassword.$error"
                :label-visible="true"
                type="password"
                placeholder="***"
                label="Ancien mot de passe"
                style="margin-bottom: 16px"
              />
              <DsfrInputGroup
                v-model="vPass$.newPassword1.$model"
                :error-message="
                  validationMessageFromErrors(vPass$.newPassword1.$errors)
                "
                :is-invalid="vPass$.newPassword1.$error"
                :label-visible="true"
                type="password"
                placeholder="***"
                label="Nouveau mot de passe"
                style="margin-bottom: 16px"
              />
              <DsfrInputGroup
                v-model="vPass$.newPassword2.$model"
                :error-message="
                  validationMessageFromErrors(vPass$.newPassword2.$errors)
                "
                :is-invalid="vPass$.newPassword2.$error"
                :label-visible="true"
                type="password"
                placeholder="***"
                label="Confirmation du nouveau mot de passe"
                style="margin-bottom: 16px"
              />
              <div style="display: flex; justify-content: flex-end">
                <DsfrButton
                  label="Sauvegarder"
                  icon="ri-save-line"
                  :disabled="vPass$.$invalid"
                  @click="changeUserPassword"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"
import { useTagStore } from "~/stores/tagStore"
import { Tag, TagCategory } from "~/composables/types"
import { computed, onMounted, reactive, ref } from "vue"
import { useVuelidate } from "@vuelidate/core"
import { email, minLength, required, sameAs } from "@vuelidate/validators"
import { validationMessageFromErrors } from "~/composables/validation"
import { DsfrButton, DsfrHighlight, DsfrSideMenu } from "@laruiss/vue-dsfr"
import { useRoute } from "vue-router"
import { useAlertStore } from "~/stores/alertStore"
import { useRouter } from "#app"

const userStore = useUserStore()
const route = useRoute()

const activeSlug = computed((): string => {
  if (!route.params.slug) {
    return "informations"
  }
  return <string>route.params.slug
})

const leftMenuItems = computed(() => {
  return [
    {
      id: 11,
      to: "/profil-informations",
      text: "Informations",
      active: activeSlug.value === "informations",
    },
    {
      id: 11,
      to: "/profil-mot-de-passe",
      text: "Mot de passe",
      active: activeSlug.value === "mot-de-passe",
    },
    {
      id: 13,
      to: "/profil-suppression",
      text: "Suppression",
      active: activeSlug.value === "suppression",
    },
  ]
})

const showDeleteConfirmation = ref(false)

const userDataState = reactive({
  email: userStore.email,
  firstName: userStore.firstName,
  lastName: userStore.lastName,
})
const passwordState = reactive({
  oldPassword: "",
  newPassword1: "",
  newPassword2: "",
})
const newPass = computed(() => passwordState.newPassword1)
const userDatarules = {
  firstName: { required },
  lastName: { required },
  email: { required, email, minLength: minLength(3) },
}
const passwordRules = {
  oldPassword: { required },
  newPassword1: { required },
  newPassword2: { required, sameAsPassword: sameAs(newPass) },
}
const v$ = useVuelidate(userDatarules, userDataState)
const vPass$ = useVuelidate(passwordRules, passwordState)

const tagStore = useTagStore()

// tags handling
const focusedCategory = ref("")
const categories = computed<TagCategory[]>(() => {
  return tagStore.categoriesByRelation("User")
})
const initialTagsByCategoryId = reactive<{ [id: number]: number[] }>({})
const selectedTagsByCategoryId = reactive<{ [id: number]: number[] }>({})
for (const category of categories.value) {
  const tags = userStore
    .tags!.map((tagId) => tagStore.tagsById[tagId])
    .filter((tag) => tag.category == category.id)
    .map((tag) => tag.id)
  initialTagsByCategoryId[category.id] = tags
  selectedTagsByCategoryId[category.id] = tags
}
const selectedTags = computed(() =>
  Object.values(selectedTagsByCategoryId).flat()
)
const focusCategory = (category: string) => (focusedCategory.value = category)
const onTagsChange = (categoryId: number, tags: Tag[]) => {
  console.log("## onTagsChange", categoryId, tags)
  selectedTagsByCategoryId[categoryId] = tags.map((tag) => tag.id)
}

const updateUser = async () => {
  console.log("updateUser", selectedTags.value)
  const { error } = await userStore.update({
    email: userDataState.email,
    firstName: userDataState.firstName,
    lastName: userDataState.lastName,
    tags: selectedTags.value,
  })
}
const changeUserPassword = async () => {
  await userStore.changePassword({
    newPassword: passwordState.newPassword1,
    oldPassword: passwordState.oldPassword,
  })
  await useRouter().push("/")
}

const deleteUser = async () => {
  console.log("deleteUser")
  const { error } = await userStore.deleteUser()
  showDeleteConfirmation.value = false
  await useRouter().push("/")
}

const deleteText =
  "Si vous supprimer votre compte, toutes les bases dont vous êtes le seul administrateur et les ressources qu’elles contiennent seront également supprimées. Cette opération est irréversible. Vous pouvez transférer l’administration de vos bases à d’autres utilisateurs avant la suppression de votre compte si vous ne souhaitez pas les voir disparaitre."

const deleteConfirmationActions = [
  {
    label: "Oui",
    onClick: deleteUser,
    class: "fr-background-flat--error",
  },
  {
    label: "Non",
    secondary: true,
    onClick: () => (showDeleteConfirmation.value = false),
  },
]

onMounted(() => {
  if (!userStore.isLoggedIn) {
    useAlertStore().alert(
      "Vous devez être connecté pour accéder à cette page",
      "",
      "warning"
    )
    useRouter().push("/")
  }
})
</script>
