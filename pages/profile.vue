<script setup>
import { useUserStore } from '~/stores/userStore'
import { useLoadingStore } from '~/stores/loadingStore'

const userStore = useUserStore()
const loadingStore = useLoadingStore()
import { DsfrButton } from '@laruiss/vue-dsfr/dist/vue-dsfr.esm'
</script>

<template>
    <div>
        <h1>Mon compte</h1>
        <p>Courriel : {{ userStore.email }}</p>
        <ul class="fr-btns-group fr-btns-group--inline">
            <li>
                <DsfrButton
                    :disabled="loadingStore.isLoading('authProfile')"
                    @click="userStore.refreshProfile"
                    label="MAJ"
                    class="fr-my-2w"
                />
            </li>
            <li>
                <DsfrButton
                    :disabled="loadingStore.isLoading('authLogout')"
                    @click="userStore.logout"
                    label="Déconnexion"
                    class="fr-my-2w"
                />
            </li>
        </ul>
    </div>
</template>
