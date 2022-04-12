<template>
<header class="fr-header" role="banner">
    <div class="fr-header__body">
        <div class="fr-container">
            <div class="fr-header__body-row">
              <DsfrLogo
                :logoText="logoTitle"
              />
            </div>
        </div>
    </div>
</header>

</template>

<script lang="ts" setup>
const logoTitle = ["La plateforme de l'ANCT"]
</script>

<style lang="sass" scoped>
.fr-header
  box-shadow: none
  border-bottom: var(--grey-925-125) 1px solid
</style>
