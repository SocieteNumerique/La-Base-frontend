<template>
  <div class="overlay">
    <div class="tooltip">
      <div class="header"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.overlay {
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.tooltip .header {
  background: var(--background-action-high-blue-france);
  color: white;
}
</style>
