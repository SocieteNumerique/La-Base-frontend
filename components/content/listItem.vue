<template>
  <div class="fr-grid-row space-between">
    <div>
      <div class="type-icon" />
      {{ content.title }}
      <DsfrTag v-if="content.licence" :label="content.licence" :small="true" />
      <button>Légender</button>
    </div>
    <div>
      <button v-if="isToSave">save</button>
      <button>delete</button>
      <button>params</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { Content } from "~/composables/types"
import { useModel } from "~/composables/modelWrapper"

const props = defineProps({
  modelValue: { type: Object as PropType<Content>, required: true },
})
const content = useModel<Content>("modelValue", { type: "object" })

const isToSave = computed<boolean>(() => !("id" in content.value))
</script>

<style lang="sass">
.space-between
  justify-content: space-between
</style>
