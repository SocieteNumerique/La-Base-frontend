<template>
    <div>
        <h1>{{ base?.title }}</h1>
        <div v-for="category of base?.categories" :key="category.id">
            <h2>{{ category.title }}</h2>
            <RessourceCard
                v-for="ressource of category.ressources"
                :key="ressource.id"
                :ressource="ressource"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useBaseStore } from '~/stores/baseStore';
import { Base } from '~/composables/types'
import RessourceCard from '~/components/ressourceCard.vue';

const route = useRoute()
const baseStore = useBaseStore()
if (!baseStore.bases.length) {
    baseStore.refreshBases()
}

const base = computed(() => {
    route.params.id
    return baseStore.basesById[route.params.id]
})
if (base.value?.isShort) {
    console.log("is short")
    baseStore.getBase(base.value.id)
}

watch(base, async (newBase: Base) => {
    console.log("### newBase", newBase)
    if (newBase?.isShort) {
        baseStore.getBase(newBase.id)
    }
})

</script>
