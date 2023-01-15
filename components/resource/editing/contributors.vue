<template>
  <div>
    <DsfrHighlight
      text="Attention : Si la fiche est en statut “Brouillon”, les contributeurs ne pourront pas y accéder, à moins d’être contributeur de la base."
    />
    <template v-if="resourceStore.current">
      <UserSelector
        v-model="resourceStore.current.contributors"
        label="Ajouter un contributeur"
      />
      <h3 class="fr-h6 fr-mb-2w fr-mt-4w">Les contributeurs</h3>
      <UserList
        :users="resourceStore.current.contributors"
        @remove="removeUserId"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { User } from "~/composables/types"
import { useResourceStore } from "~/stores/resourceStore"

const resourceStore = useResourceStore()

const removeUserId = (userId: number) => {
  resourceStore.current.contributors =
    resourceStore.current.contributors!.filter(
      (user: User) => user.id !== userId
    )
}
</script>
