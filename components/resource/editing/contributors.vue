<template>
  <div>
    <DsfrHighlight
      text="Attention : Si la fiche est en statut “Brouillon”, les contributeurs ne pourront pas y accéder, à moins d’être contributeur de la base."
    />
    <UserSelector v-model="contributors" label="Ajouter un contributeur" />
    <h3 class="fr-h6 fr-mb-2w fr-mt-4w">Les contributeurs</h3>
    <UserList :users="contributors" @remove="removeUserId" />
  </div>
</template>
<script setup lang="ts">
import { User } from "~/composables/types"
import { useResourceStore } from "~/stores/resourceStore"

const resourceStore = useResourceStore()

const contributors = ref<User[]>(resourceStore.current.contributors || [])
const removeUserId = (userId: number) => {
  contributors.value = contributors.value.filter(
    (user: User) => user.id !== userId
  )
}
</script>
