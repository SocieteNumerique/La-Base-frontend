<template>
    <div>
        <h1 class="fr-mt-4w">Accueil</h1>
        <h2 class="fr-mt-5w">Mes bases</h2>
        <div class="is-flex fr-mb-4w">
            <BaseCard
                v-for="baseId of baseStore.bases"
                :key="baseId"
                :base="baseStore.basesById[baseId]"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useBaseStore } from '~/stores/baseStore';
import { useMainStore } from '~/stores/mainStore';

const router = useRouter()
const mainStore = useMainStore()
const baseStore = useBaseStore()

if (!baseStore.bases.length) {
    console.log("### refreshbases", baseStore.bases)
    baseStore.refreshBases()
}

</script>
