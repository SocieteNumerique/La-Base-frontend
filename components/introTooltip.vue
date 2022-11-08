<template>
  <div
    class="tooltip-container"
    :slug="props.slug"
    :class="isActive ? 'active' : ''"
  >
    <slot />
    <div v-if="isActive" class="tooltip" :class="introStore.current.position">
      <VIcon
        :scale="1.25"
        name="ri-close-line"
        style="position: absolute; right: 16px; top: 16px; cursor: pointer"
        color="white"
        @click="introStore.markSeen()"
      />
      <div class="header fr-py-2w fr-text--bold">
        {{ introStore.current?.title }}
      </div>
      <div
        v-if="introStore.current?.image"
        style="
          background-position: center;
          background-size: cover;
          width: 100%;
          height: 155px;
        "
        :style="`background-image: url('${introStore.current.image}')`"
      ></div>
      <div
        class="fr-p-2w html-content"
        v-html="introStore.current?.htmlContent"
      ></div>
      <div v-if="introStore.forPage.length > 1" class="tooltip-footer fr-p-2w">
        <div class="fr-text--sm fr-text--disabled fr-m-0">
          {{ introStore.indexInPage + 1 }} sur
          {{ introStore.forPage.length }}
        </div>
        <div class="fr-btns-group--sm">
          <button
            class="fr-btn fr-btn--secondary fr-mr-2w"
            :disabled="!introStore.canGoPrevious"
            @click="introStore.previous"
          >
            Précédent
          </button>
          <button
            class="fr-btn"
            :disabled="!introStore.canGoNext"
            @click="introStore.next"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntroStore } from "~/stores/introStore"
import { computed } from "vue"

const introStore = useIntroStore()

const isActive = computed(
  () => introStore.current && introStore.current.slug === props.slug
)

const props = defineProps({
  slug: { type: String, required: true },
})
</script>

<style>
/* cannot be scoped because the `p` is not really part of the component (v-html) */
.html-content p:last-child {
  margin-bottom: 0;
}
</style>

<style scoped>
.tooltip-container.active {
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
  width: 312px;

  border: 1px solid var(--background-action-high-blue-france);
  background: white;
}

.tooltip.bottom {
  left: calc(50% - 156px);
  top: calc(100% + 15px);
}
.tooltip.bottom:after {
  border-color: transparent transparent
    var(--background-action-high-blue-france) transparent;
  top: -28px;
  left: calc(50% - 15px);
}
.tooltip.top {
  left: calc(50% - 156px);
  bottom: calc(100% + 15px);
}
.tooltip.top:after {
  border-color: var(--background-action-high-blue-france) transparent
    transparent transparent;
  bottom: -28px;
  left: calc(50% - 15px);
}
.tooltip.right {
  left: calc(100% + 15px);
  top: 0;
}
.tooltip.right:after {
  border-color: transparent var(--background-action-high-blue-france)
    transparent transparent;
  top: 15px;
  left: -29px;
}
.tooltip.left {
  left: calc(-312px - 15px);
  top: 0;
}
.tooltip.left:after {
  border-color: transparent transparent transparent
    var(--background-action-high-blue-france);
  top: 15px;
  right: -29px;
}

.tooltip:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-width: 14px;
  border-style: solid;
}

.tooltip-footer {
  display: flex;
  justify-content: space-between;
}

.tooltip-footer .fr-btns-group--sm {
  display: flex;
  justify-content: flex-end;
}
</style>
