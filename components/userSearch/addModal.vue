<template>
  <DsfrModal
    title="Enregistrer la recherche"
    :actions="actions"
    :opened="true"
    @close="emit('close')"
  >
    <DsfrInput
      v-model="name"
      label="Nom de la recherche"
      :label-visible="true"
      maxlength="30"
      :hint="`${name.length} / 30 caractères`"
      placeholder="Nouveau nom"
    />
  </DsfrModal>
</template>

<script setup lang="ts">
import { useUserSearchStore } from "~/stores/userSearchStore"
import { useRoute } from "vue-router"
import { PropType } from "vue"
import { UserSearchQuery } from "~/composables/types"

const userSearchStore = useUserSearchStore()
const route = useRoute()

const emit = defineEmits(["close"])
const props = defineProps({
  query: { type: Object as PropType<UserSearchQuery>, required: true },
})

const name = ref("")
const actions = computed(() => [
  {
    label: "Enregistrer",
    onClick: save,
    disabled: name.value.length < 3,
  },
  {
    label: "Annuler",
    secondary: true,
    onClick: () => emit("close"),
  },
])

const save = async () => {
  const { data } = await userSearchStore.addUserSearch(
    props.query,
    name.value,
    <"resources" | "bases">route.query.dataType || "resources"
  )
  if (data.value) {
    emit("close")
  }
}
</script>
