<script setup>
import { useUserStore } from "~/stores/userStore"
import { useLoadingStore } from "~/stores/loadingStore"

const userStore = useUserStore()
const loadingStore = useLoadingStore()
</script>

<template>
  <div>
    <h1>Mon compte</h1>
    <p>Courriel : {{ userStore.email }}</p>
    <ul class="fr-btns-group fr-btns-group--inline">
      <li>
        <DsfrButton
          :disabled="loadingStore.isLoading('authProfile')"
          label="MAJ"
          class="fr-my-2w"
          @click="userStore.refreshProfile"
        />
      </li>
      <li>
        <DsfrButton
          :disabled="loadingStore.isLoading('authLogout')"
          label="Déconnexion"
          class="fr-my-2w"
          @click="userStore.logout"
        />
      </li>
    </ul>
  </div>
</template>
