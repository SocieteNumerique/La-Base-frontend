import { defineStore } from "pinia"
import { User } from "~/composables/types"
import { useBaseStore } from "~/stores/baseStore"
import { useCollectionStore } from "~/stores/collectionStore"
import { useResourceStore } from "~/stores/resourceStore"

function resetPerUserData() {
  useCollectionStore().collectionsById = {}
  useResourceStore().resourcesById = {}
  useBaseStore().basesById = {}
}

export const useUserStore = defineStore("user", {
  state: () => ({
    email: "",
    firstName: "",
    id: 0,
    lastName: "",
    prefillEmail: "",
    showSignupModal: false,
    isCnfs: false,
  }),
  actions: {
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
        this.updateState(data.value)
        const baseStore = useBaseStore()
        resetPerUserData()
        baseStore.refreshBases()
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
        })
        const router = useRouter()
        const baseStore = useBaseStore()
        baseStore.refreshBases()
        resetPerUserData()
        router.push("/")
      }
    },
    async refreshProfile() {
      const { data, error } = await useApiGet<User>("users/me/")
      if (!error.value) {
        this.updateState(data.value)
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
        true
      )

      return { data, error }
    },
    updateState(data: User) {
      this.email = data.email
      this.firstName = data.firstName
      this.lastName = data.lastName
      this.isCnfs = data?.isCnfs || false
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.email,
  },
})
