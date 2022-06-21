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
        true
      )
      if (!error.value) {
        this.updateState(data.value)
        const baseStore = useBaseStore()
        resetPerUserData()
        baseStore.refreshBases()
      }
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
      const { data, error } = await useApiGet<User>("auth/profile")
      if (!error.value) {
        this.updateState(data.value)
      }
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
          title: "Création réussie",
          text: "Vous êtes dès à présent connectés",
        },
        true
      )
      if (!error.value) {
        this.updateState(data.value)
        await this.refreshProfile()
        const baseStore = useBaseStore()
        await baseStore.refreshBases()
      }

      return { data, error }
    },
    updateState(data: User) {
      this.email = data.email
      this.firstName = data.firstName
      this.lastName = data.lastName
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.email,
  },
})
