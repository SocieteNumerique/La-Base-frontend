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
    <ResourceEditingContents
      v-else-if="resourceStore.isMenuActive('contents')"
    />
  </div>
</template>

<script lang="ts" setup>
import { useResourceStore } from "~/stores/resourceStore"

const resourceStore = useResourceStore()
</script>

<style scoped></style>
