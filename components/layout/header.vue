<template>
  <header class="fr-header" role="banner">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <NuxtLink to="/"><DsfrLogo :logo-text="logoTitle" /></NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
const logoTitle = ["La base de la médiation ", "et de l’inclusion numérique"]
</script>

<style lang="sass" scoped>
.fr-header
  box-shadow: none
  border-bottom: var(--grey-925-125) 1px solid
</style>
