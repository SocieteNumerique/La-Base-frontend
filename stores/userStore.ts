import { defineStore } from "pinia"
import { User } from "~/composables/types"
import { useBaseStore } from "~/stores/baseStore"
import { useCollectionStore } from "~/stores/collectionStore"
import { useResourceStore } from "~/stores/resourceStore"
import { useApiDelete } from "~/composables/api"
import { useAlertStore } from "~/stores/alertStore"
import { useIntroStore } from "~/stores/introStore"

function resetPerUserData() {
  useCollectionStore().collectionsById = {}
  useResourceStore().resourcesById = {}
  useBaseStore().basesById = {}
}

export const useUserStore = defineStore("user", {
  state: (): User => ({
    email: "",
    firstName: "",
    id: 0,
    isAdmin: false,
    isCnfs: false,
    isStaff: false,
    lastName: "",
    prefillEmail: "",
    showSignupModal: false,
    tags: [],
  }),
  actions: {
    async changePassword(payload: {
      oldPassword: string
      newPassword: string
    }) {
      const { data, error } = await useApiPatch(
        `users/${this.id}/password/`,
        payload,
        {},
        "Le mot de passe a bien été modifié",
        false
      )
      if (error.value) {
        let text = ""
        // @ts-ignore
        if (Object.keys(error.value?.data).indexOf("oldPassword") !== -1) {
          text = "L'ancien mot de passe ne correspond pas à celui du compte"
        } else {
          // @ts-ignore
          text = JSON.stringify(error.value.data)
        }
        useAlertStore().alert(
          "Erreur lors de la modification du mot de passe",
          text,
          "error"
        )
      } else {
        this.resetUserState()
        useAlertStore().alert(
          "Vous devez maintenant vous reconnecter",
          "",
          "warning"
        )
      }

      return { data, error }
    },
    async deleteUser() {
      const { data, error } = await useApiDelete<User>(
        `users/${this.id}/`,
        {},
        "L'utilisateur a bien été supprimé",
        {
          title: "Erreur lors de la suppression de l'utilisateur",
          text: "_responseBody",
        }
      )
      if (!error.value) {
        this.resetUserState()
      }
      return { data, error }
    },
    async login(email: string, password: string) {
      const { data, error } = await useApiPost<User>(
        "auth/login",
        {
          email,
          password,
        },
        {},
        { title: "Connexion réussie" },
        { title: "Connexion impossible", text: "_responseBody" }
      )
      if (!error.value) {
        this.updateState(data.value!)
        const introStore = useIntroStore()
        introStore.resetLocallySeen()
        const baseStore = useBaseStore()
        resetPerUserData()
        await baseStore.refreshBases()
      }

      return { data, error }
    },
    async logout() {
      const { error } = await useApiPost<User>(
        "auth/logout",
        {},
        {},
        { title: "Déconnexion réussie" }
      )
      if (!error.value) {
        this.updateState({
          id: 0,
          firstName: "",
          lastName: "",
          email: "",
          tags: [],
        })
        const introStore = useIntroStore()
        introStore.resetLocallySeen()
        const baseStore = useBaseStore()
        await baseStore.refreshBases()
        resetPerUserData()
      }
    },
    async refreshProfile() {
      const { data, error } = await useApiGet<User>("users/me/")
      if (!error.value) {
        this.updateState(data.value!)
      }
    },
    async resendConfirmationEmail(email: string) {
      return useApiGet(
        `auth/send-email-confirmation/${email}/`,
        {},
        "Email de confirmation envoyé",
        true
      )
    },
    async resetPassword(email: string) {
      return useApiGet(
        `password/reset?email=${email}`,
        {},
        { title: `Lien envoyé à ${email}`, text: "Vérifiez votre boite mail" },
        "Erreur lors de la réinitialisation du mot de passe"
      )
    },
    resetUserState() {
      this.$state = {
        email: "",
        firstName: "",
        id: 0,
        lastName: "",
        prefillEmail: "",
        showSignupModal: false,
        isCnfs: false,
        tags: [],
      }
    },
    async signup(payload: User) {
      const { data, error } = await useApiPost<User>(
        "users/",
        payload,
        {},
        {
          title: "Compte créé - vérification en attente",
          text: "Vérifiez votre boite mail pour valider votre compte",
          type: "info",
        },
        { title: "Impossible de créer le compte", text: "_responseBody" }
      )

      return { data, error }
    },
    async update(user: User) {
      const { data, error } = await useApiPatch<User>(
        `users/${this.id}/`,
        user,
        {},
        "Les informations ont bien été enregistrées",
        {
          title: "Erreur lors de l'enregistrement des informations",
          text: "_responseBody",
        }
      )
      if (!error.value) {
        this.updateState(data.value!)
      }
      return { data, error }
    },
    updateState(data: User) {
      this.email = data.email
      this.firstName = data.firstName
      this.lastName = data.lastName
      this.isCnfs = data?.isCnfs || false
      this.tags = data!.tags
      this.isAdmin = data!.isAdmin
      this.isStaff = data!.isStaff
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.email,
  },
})
