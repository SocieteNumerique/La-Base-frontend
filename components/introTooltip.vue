<template>
  <div class="tooltip-container">
    <slot />
    <div class="tooltip">
      <div class="header">My title</div>
      <h2 class="fr-h6">Nouveau texte</h2>
      <button class="close"></button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.tooltip-container {
  position: relative;
  z-index: 101;
  background: white;
}

.tooltip .header {
  background: var(--background-action-high-blue-france);
  color: white;
  text-align: center;
}

.tooltip {
  position: absolute;
  width: 250px;
  left: calc(50% - 125px);
  top: calc(100% + 15px);
  border: 1px solid var(--background-action-high-blue-france);
  background: white;
}

.tooltip:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-width: 14px;
  border-style: solid;
  border-color: transparent transparent
    var(--background-action-high-blue-france) transparent;
  top: -28px;
  left: calc(50% - 15px);
}
</style>
