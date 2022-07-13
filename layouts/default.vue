<template>
  <div class="nuxt-body" data-fr-theme>
    <LayoutHeader />
    <div class="fr-container alert-container" style="height: 0">
      <LayoutAlert
        v-for="alert of alertStore.getAlerts"
        :key="alert.id"
        :alert="alert"
        @close="closeAlert(alert.id)"
      />
    </div>
    <slot name="header">
      <div class="fr-container fr-mt-4w">
        <div v-if="route.meta.title" class="fr-grid-row">
          <h1>{{ route.meta.title }}</h1>
        </div>
      </div>
    </slot>

    <div :class="mainStore.useFullWidthLayout ? null : 'fr-container fr-mt-4w'">
      <div :class="mainStore.useFullWidthLayout ? null : 'fr-mb-11v'">
        <slot />
      </div>
    </div>

    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { useAlertStore } from "~/stores/alertStore"
import { useMainStore } from "~/stores/mainStore"

const alertStore = useAlertStore()
const mainStore = useMainStore()

const route = useRoute()

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
    justify-content: start
    align-items: end

  footer
    margin-top: auto
</style>
