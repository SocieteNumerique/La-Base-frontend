<template>
  <div
    class="is-flex flex-center full-height cancel-message-block fr-text--sm fr-p-2w"
  >
    <div>
      <p>
        <slot></slot>
      </p>
      <div class="is-flex flex-center">
        <button
          class="fr-btn fr-btn--icon-right fr-btn--tertiary-no-outline fr-btn--sm"
          @click="onClickCancel()"
        >
          Annuler
          <span class="fr-pl-1w">
            <VIcon name="ri-arrow-go-back-line" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emits = defineEmits(["cancel"])

const onClickCancel = () => {
  emits("cancel")
}
</script>

<style lang="sass" scoped>
.cancel-message-block
  min-height: 400px
</style>
