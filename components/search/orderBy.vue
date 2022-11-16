<template>
  <div style="display: flex; align-items: flex-end">
    <p class="fr-m-0" style="padding-bottom: 6px; padding-right: 20px">
      Trier par
    </p>
    <DsfrSelect v-model="orderBy" label="" :options="orderByOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const router = useRouter()

const updateRouterQuery = (newQueryParams: any) => {
  router.replace({ query: { ...route.query, ...newQueryParams } })
}

const orderBy = computed<string>({
  get: () => <string>route.query.orderBy || "-modified",
  set(newValue: string) {
    updateRouterQuery({ orderBy: newValue, page: 0 })
  },
})
const orderByOptions = [
  { text: "Du plus récent au plus ancien", value: "-modified" },
  { text: "Du plus ancien au plus récent", value: "modified" },
  { text: "Du plus vu au moins vu", value: "-visit_count" },
  { text: "Du moins vu au plus vu", value: "visit_count" },
]
</script>
