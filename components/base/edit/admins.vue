<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    title="Administrateurs de la base"
    @close="$emit('close')"
  >
    <UserSelector v-model="admins" label="Ajouter" />
    <label class="fr-label fr-pt-3w">Les administrateurs</label>
    <ul class="fr-text--xs fr-px-0">
      <li
        v-for="admin of admins"
        :key="admin.id"
        class="item has-children-space-between"
      >
        <div>{{ admin.firstName }} {{ admin.lastName }}</div>
        <button
          class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-text-title--blue-france action"
          @click="removeUserId(admin.id)"
        >
          <VIcon class="fr-mr-2v" name="ri-close-line" />
          Retirer
        </button>
      </li>
    </ul>
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

<style lang="sass" scoped>
.item
  border-bottom: 1px solid var(--border-default-grey)
  padding: 12px
  display: flex
  align-items: center
  width: 100%
  height: 44px

  .action
    display: none
    margin-left: auto

  &:hover .action
    display: block
</style>
