<template>
  <div class="result-line">
    <div class="tag-line fr-py-1w">
      <button
        :disabled="disabled"
        class="fr-m-0 cursor--pointer fr-text--sm"
        style="text-align: left"
        :title="props.tag.name"
        @click="onTagNameClick"
      >
        {{ props.tag.name }}
      </button>
      <div class="fr-text--sm fr-m-0 grid-tag-icons">
        <button
          v-if="props.tag.definition"
          title="définition"
          style="padding: 0"
          @click="showDefinition = !showDefinition"
        >
          <VIcon
            class="cursor--pointer"
            :name="
              showDefinition ? 'ri-information-fill' : 'ri-information-line'
            "
            :scale="0.9"
            color="var(--text-action-high-blue-france)"
          />
        </button>

        <span v-else class="no-information">·</span>
        <span class="tag-count" title="nombre d'occurences">
          {{
            props.countOrigin === "base"
              ? tag?.baseCount
              : tag?.resourceCount || 0
          }}
        </span>
        <VIcon
          v-if="!props.tag.isFree"
          name="official-line"
          :scale="0.9"
          title="tag officiel"
        />
        <div v-else>·</div>
      </div>
    </div>
    <p v-if="showDefinition" class="fr-mb-1w fr-text--xs fr-text-default--grey">
      {{ props.tag.definition }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Tag } from "composables/types"
import { PropType } from "vue"

const props = defineProps({
  countOrigin: { type: String, default: "resource" },
  tag: { type: Object as PropType<Tag>, required: true },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(["select"])

const onTagNameClick = () => {
  if (!props.disabled) {
    emit("select")
  }
}

const showDefinition = ref(false)
</script>

<style lang="sass">
.tag-line
  display: flex
  justify-content: space-between
  p
    width: 260px

.grid-tag-icons
  display: grid
  grid-auto-flow: column
  grid-template-columns: 16px 30px 15px
  grid-column-gap: 4px
  align-items: center
  text-align: center

  > span
    display: inline-block
</style>
