<template>
  <div class="nuxt-body" data-fr-theme style="position: relative">
    <DsfrSkipLinks :links="links" />
    <LayoutHeader />
    <div class="fr-container alert-container" style="height: 0">
      <LayoutAlert
        v-for="alert of alertStore.getAlerts"
        :key="alert.id"
        :alert="alert"
        @close="closeAlert(alert.id)"
      />
    </div>

    <DsfrModal
      v-if="loadingStore.showLoadingOverlay"
      :title="loadingStore.message"
      class="spinner-modal"
      opened
    >
      <div class="loading-container fr-m-auto" tabindex="0">
        <VIcon scale="3" name="ri-loader-2-line" animation="spin" />
      </div>
    </DsfrModal>

    <slot name="header">
      <div
        v-if="route.meta.title"
        :id="mainStore.hasHeader ? 'content' : null"
        class="fr-container fr-mt-4w"
      >
        <div class="fr-grid-row">
          <h1>{{ route.meta.title }}</h1>
        </div>
      </div>
    </slot>

    <div
      :id="mainStore.hasHeader ? null : 'content'"
      :class="mainStore.useFullWidthLayout ? null : 'fr-container fr-mt-4w'"
    >
      <div :class="mainStore.useFullWidthLayout ? null : 'fr-mb-11v'">
        <slot />
      </div>
    </div>

    <LayoutFooter />
    <DsfrModal
      v-if="mainStore.confirmation.title"
      :title="mainStore.confirmation.title"
      :opened="true"
      :actions="confirmActions"
    >
      {{ mainStore.confirmation.text }}
    </DsfrModal>
  </div>
</template>

<script setup lang="ts">
import { useAlertStore } from "~/stores/alertStore"
import { useMainStore } from "~/stores/mainStore"
import { useLoadingStore } from "~/stores/loadingStore"

const alertStore = useAlertStore()
const mainStore = useMainStore()
const loadingStore = useLoadingStore()

const route = useRoute()

const confirmActions = computed(() => {
  if (!mainStore.confirmation.title) {
    return []
  }
  return [
    { label: "Confirmer", onClick: mainStore.confirmation.onConfirm },
    {
      label: "Annuler",
      onClick: mainStore.confirmation.onCancel,
      secondary: true,
    },
  ]
})
const links = [
  {
    id: "content",
    text: "Aller au contenu",
  },
  {
    id: "footer",
    text: "Aller au pied de page",
  },
]

const closeAlert = (alertId: string) => {
  alertStore.removeAlert(alertId)
}
</script>

<style lang="sass">
.nuxt-body
  display: flex
  flex-flow: column
  min-height: 100vh

  .alert-container
    top: 168px
    z-index: 10000000
    position: fixed
    width: 100vw
    transform: translateX(-50%)
    left: 50%
    display: flex
    flex-direction: column
    justify-content: flex-start
    align-items: flex-end

  footer
    margin-top: auto

  .spinner-modal
    z-index: 10000
    .fr-modal__header .fr-btn
      display: none

    .loading-container
      width: fit-content
</style>
