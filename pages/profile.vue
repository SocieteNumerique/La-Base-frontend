<script setup>
import { useUserStore } from '~/stores/userStore'
import { useLoadingStore } from '~/stores/loadingStore'

const userStore = useUserStore()
const loadingStore = useLoadingStore()
</script>

<template>
    <div>
        <h1>Mon compte</h1>
        <p>Courriel : {{ userStore.email }}</p>
        <DsfrButton
            @click="userStore.refreshProfile"
            :disabled="loadingStore.isLoading('authProfile')"
            label="MAJ"
            class="fr-my-2w"
        />
    </div>
</template>
