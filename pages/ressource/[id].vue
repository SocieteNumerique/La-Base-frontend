<template>
    <div>
        <h1>{{ ressource?.title }}</h1>
        <p>{{ ressource?.content }}</p>
    </div>
</template>

<script setup lang="ts">
import { useBaseStore } from '~/stores/baseStore';
import { Ressource } from '~/composables/types'

const route = useRoute()
const baseStore = useBaseStore()


if (!baseStore.ressourcesById[route.params.id]) {
    baseStore.getRessource(route.params.id)
}



const ressource = computed(() => baseStore.ressourcesById[route.params.id])
// if (base.value?.isShort) {
//     console.log("is short")
//     baseStore.getBase(base.value.id)
// }

// watch(base, async (newBase: Base) => {
//     console.log("### newBase", newBase)
//     if (newBase.isShort) {
//         baseStore.getBase(newBase.id)
//     }
// })

</script>
