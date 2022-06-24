<template>
  <div class="nuxt-body" data-fr-theme>
    <LayoutHeader />
    <slot name="header">
      <div class="fr-container fr-mt-4w">
        <div v-if="route.meta.title" class="fr-grid-row">
          <h1>{{ route.meta.title }}</h1>
        </div>
      </div>
    </slot>
    <div
      style="
        position: fixed;
        width: 400px;
        left: calc(50vw - 200px);
        top: 50px;
        z-index: 10000000;
      "
    >
      <DsfrAlert
        v-for="alert of alertStore.getAlerts"
        :key="alert.id"
        :title="alert.title"
        :description="alert.text"
        :type="alert.type"
        :closeable="true"
        style="background: white"
        @close="closeAlert(alert.id)"
      />
    </div>

    <div :class="mainStore.useFullWidthLayout ? null : 'fr-container fr-mt-4w'">
      <div :class="mainStore.useFullWidthLayout ? null : 'fr-mb-11v'">
        <slot />
      </div>
    </div>

    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { DsfrAlert } from "@laruiss/vue-dsfr"
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

  footer
    margin-top: auto
</style>
