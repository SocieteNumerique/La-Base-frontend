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
const dataType = computed<string>(() => {
  return <string>route.query.dataType || "resources"
})

const orderBy = computed<string>({
  get: () => <string>route.query.orderBy || "-modified",
  set(newValue: string) {
    updateRouterQuery({ orderBy: newValue, page: 0 })
  },
})
const orderByOptions = computed(() => {
  let toReturn = [
    { text: "Du plus récent au plus ancien", value: "-modified" },
    { text: "Du plus ancien au plus récent", value: "modified" },
    { text: "Du plus vu au moins vu", value: "-visit_count" },
    { text: "Du moins vu au plus vu", value: "visit_count" },
    // { text: "Du mieux noté au moins bien noté", value: "-rating" },
    // { text: "Du moins bien noté au mieux noté", value: "rating" },
  ]
  if (dataType.value == "resources") {
    toReturn = toReturn.concat([
      { text: "Du plus enregistré au moins enregistré", value: "-pin_count" },
      { text: "Du moins enregistré au plus enregistré", value: "pin_count" },
      {
        text: "Du plus recommandé au moins recommandé",
        value: "-recommendation_mean",
      },
      {
        text: "Du moins recommandé au plus recommandé",
        value: "recommendation_mean",
      },
    ])
  }
  if (dataType.value == "bases") {
    toReturn = toReturn.concat([
      {
        text: "Du plus de favoris au moins de favoris",
        value: "-bookmarked_count",
      },
      {
        text: "Du moins de favoris au plus de favoris",
        value: "bookmarked_count",
      },
    ])
  }

  return toReturn
})
</script>
