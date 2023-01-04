<template>
  <div>
    <div
      class="tooltip-container"
      :slug="props.slug"
      :class="isActive ? 'active' : ''"
      :style="props.childDisplay ? `display: ${props.childDisplay}` : null"
    >
      <slot />
      <div
        v-if="isActive"
        class="tooltip"
        :class="introStore.current.position"
        style="font-weight: normal"
      >
        <VIcon
          :scale="1.25"
          name="ri-close-line"
          style="position: absolute; right: 16px; top: 16px; cursor: pointer"
          color="white"
          @click="introStore.done"
        />
        <div class="header fr-py-2w fr-text--bold">
          {{ introStore.current?.title }}
        </div>
        <img
          v-if="introStore.current.image"
          :src="introStore.current.image"
          alt=""
          style="
            width: 100%;
            border-bottom: 1px solid var(--background-action-high-blue-france);
          "
        />
        <div
          class="fr-p-2w html-content fr-text--sm fr-m-0"
          style="text-align: left"
          v-html="introStore.current?.htmlContent"
        ></div>
        <div
          v-if="introStore.availableIntros.length > 1"
          class="tooltip-footer fr-p-2w"
          style="align-items: center"
        >
          <div class="fr-text--sm fr-text--disabled fr-m-0">
            {{ introStore.currentIndex + 1 }} sur
            {{ introStore.availableIntros.length }}
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
              v-if="introStore.canGoNext"
              class="fr-btn force-btn-colors"
              @click="introStore.next"
            >
              Suivant
            </button>
            <button
              v-else
              class="fr-btn force-btn-colors"
              @click="introStore.done"
            >
              Terminer
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isActive" class="overlay"></div>
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
  childDisplay: { type: String, default: "" },
})
</script>

<style>
/* cannot be scoped because the `p` is not really part of the component (v-html) */
.html-content p:last-child {
  margin-bottom: 0;
}
.html-content p {
  font-size: 14px;
}
</style>

<style scoped>
.tooltip-container.active {
  position: relative;
  z-index: 10001;
  background: white;
}

.tooltip .header {
  background: var(--background-action-high-blue-france);
  color: white;
  text-align: center;
}

.tooltip {
  position: absolute;
  width: 348px;

  border: 1px solid var(--background-action-high-blue-france);
  background: white;
}

.tooltip.bottom {
  left: calc(50% - 173px);
  top: calc(100% + 15px);
}
.tooltip.bottom:after {
  border-color: transparent transparent
    var(--background-action-high-blue-france) transparent;
  top: -28px;
  left: calc(50% - 15px);
}
.tooltip.top {
  left: calc(50% - 173px);
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
<style scoped lang="sass">
.overlay
  background-color: rgba(0, 0, 0, 0.5)
  z-index: 10000
  position: fixed
  top: 0
  left: 0
  bottom: 0
  right: 0

// colors are otherwise overwritten by header colors
.fr-btn.force-btn-colors
  background-color: var(--background-action-high-blue-france)
  color: var(--text-inverted-blue-france)
</style>
