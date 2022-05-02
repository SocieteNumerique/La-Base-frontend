<template>
  <div>
    <div
      v-if="
        resourceStore.isMenuActive('informations') &&
        resourceStore.isSubMenuActive('general')
      "
    >
      <ResourceEditingGeneralInfo />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useResourceStore } from "~/stores/resourceStore"

const resourceStore = useResourceStore()
</script>

<style scoped></style>
