<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    :title="modalTitle"
    @close="$emit('close')"
  >
    <div class="base-form-container">
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
        :large-image="true"
      />
    </div>
  </DsfrModal>
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { Base, BaseCreate } from "~/composables/types"
import { computed } from "vue"
import { useRoute } from "vue-router"

const baseStore = useBaseStore()
const route = useRoute()

const baseId = parseInt(<string>route.params.id)
const emits = defineEmits(["close", "save", "done"])

const modalTitle = "Changer les images de profil et de couverture"

const fileActionWord = (attrName: "profileImage" | "coverImage") =>
  base.value[attrName] ? "Ajouter une " : "Changer l'"
const profileActionWord = computed<string>(() => fileActionWord("profileImage"))
const coverActionWord = computed<string>(() => fileActionWord("coverImage"))

const base = ref<Base | BaseCreate>({
  ...baseStore.current,
})

async function updateBase() {
  emits("save", base.value)
}

const actions = computed(() => [
  {
    label: "Valider",
    onClick: updateBase,
    disabled: false,
  },
  {
    label: "Annuler",
    secondary: true,
    onClick: () => emits("close"),
  },
])
</script>

<style lang="sass"></style>
