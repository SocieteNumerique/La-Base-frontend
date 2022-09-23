<template>
  <span @click="copyLink">
    <slot>
      <button
        class="fr-btn fr-btn--secondary btn--no-border fr-btn--sm fr-py-0"
        title="Partager"
        aria-label="Partager"
      >
        <VIcon :scale="0.9" name="ri-share-line" />
      </button>
    </slot>
  </span>
</template>

<script lang="ts" setup>
import { useAlertStore } from "~/stores/alertStore"

const alertStore = useAlertStore()
const props = defineProps({
  link: { type: String, default: "" },
})

function copyLink() {
  if (process.server || !props.link) return
  navigator.clipboard.writeText(
    `${window.location.protocol}//${window.location.host}${props.link}`
  )
  alertStore.alert("Lien copié dans le presse-papier")
}
</script>

<style lang="sass" scoped>
.fr-btn
  border: 1px solid var(--text-action-high-blue-france)
  display: flex
  align-items: center
  justify-content: center
  border-radius: 100%
  width: 32px
  height: 30px
  padding-top: 1px

.fr-btn:disabled
  border: 1px solid var(--text-disabled-grey)
</style>
