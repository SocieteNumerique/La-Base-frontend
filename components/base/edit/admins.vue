<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    title="Administrateurs de la base"
    @close="$emit('close')"
  >
    <UserSelector v-model="admins" label="Ajouter" />
    <label class="fr-label fr-pt-3w">Les administrateurs</label>
    <UserList :list="admins" @remove="removeUserId" />
  </DsfrModal>
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { User } from "~/composables/types"

const baseStore = useBaseStore()
const emits = defineEmits(["close", "save"])
const admins = ref<User[]>([...(baseStore.current.admins || [])])

async function updateBase() {
  emits("save", {
    id: baseStore.currentId!,
    admins: admins.value,
  })
}

const removeUserId = (userId: number) => {
  admins.value = admins.value.filter((user: User) => user.id !== userId)
}

const actions = [
  {
    label: "Enregistrer",
    onClick: updateBase,
  },
  {
    label: "Annuler",
    secondary: true,
    onClick: () => emits("close"),
  },
]
</script>
