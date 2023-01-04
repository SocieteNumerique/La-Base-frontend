<template>
  <div class="fr-tile">
    <div class="fr-tile__body">
      <div class="content fr-pt-1w">
        <div
          style="
            display: flex;
            border-right: 1px solid var(--border-default-grey);
          "
        >
          <div class="left-icon">
            <img :src="props.icon" height="60" alt="" />
          </div>
          <div class="fr-ml-4w" style="text-align: left">
            <h3 class="fr-h4">{{ props.title }}</h3>
            <div class="fr-tile__desc">
              <TextBlock :slug="props.descriptionSlug" :required="false" />
            </div>
            <div class="fr-mt-4w">
              <NuxtLink :to="props.to" class="fr-btn fr-btn--sm"
                >Accéder <VIcon class="fr-ml-1w" name="ri-arrow-right-line"
              /></NuxtLink>
            </div>
          </div>
        </div>

        <div class="fr-pl-5w" style="text-align: left">
          <TextBlock :slug="props.textSlug" />
          <div v-if="showMore" class="fr-mt-2w">
            <TextBlock :slug="props.moreTextSlug" />
          </div>
          <div v-if="canShowMore" class="fr-mt-3w show-more-button-holder">
            <div style="display: flex; justify-content: flex-end">
              <div @click="showMore = !showMore">
                <DsfrButton
                  v-if="!showMore"
                  class="fr-btn--tertiary-no-outline fr-btn--sm"
                  label="Voir plus"
                  icon="ri-add-line"
                />
                <DsfrButton
                  v-if="showMore"
                  class="fr-btn--tertiary-no-outline fr-btn--sm"
                  label="Voir moins"
                  icon="ri-subtract-line"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTextBlockStore } from "~/stores/textBlockStore"
import { DsfrButton } from "@gouvminint/vue-dsfr"

const props = defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  descriptionSlug: { type: String, required: true },
  textSlug: { type: String, required: true },
  moreTextSlug: { type: String, default: "" },
  to: { type: String, required: true },
})

const textBlockStore = useTextBlockStore()
const canShowMore = computed<boolean>(
  () => !!textBlockStore.blockBySlug[props.moreTextSlug]
)
const showMore = ref(false)
</script>

<style scoped>
.content {
  display: flex;
  align-self: stretch;
}
.content > div {
  flex-grow: 1;
  flex-basis: 0;
}
.left-icon {
  min-width: 160px;
  min-height: 160px;
  width: 160px;
  height: 160px;
  background: var(--background-alt-blue-france);
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.show-more-button-holder {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
