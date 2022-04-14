<template>
  <!-- TODO this is a draft -->
  <div class="glossary-preview">{{ props.word }}</div>
</template>

<script lang="ts" setup>
const props = defineProps({
  word: String
})
</script>

<style lang="sass" scoped>
.glossary-preview
  height: 200px
  width: 200px
  position: absolute
  background-color: var(--blue-france-850-200)
  overflow: hidden
</style>
