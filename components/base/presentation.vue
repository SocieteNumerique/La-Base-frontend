<template>
  <div class="fr-container">
    <h2 class="fr-h3 fr-mb-3w">Présentation</h2>
    <div class="is-flex fr-mb-3w" style="align-items: center">
      <div class="stat">
        <span class="fr-text--xl fr-text--bold">{{
          base?.stats.visitCount
        }}</span>
        <span>{{ pluralize(["vue"], base?.stats.visitCount) }}</span>
      </div>
      <div class="stat">
        <span class="fr-text--xl fr-text--bold">{{
          base?.stats.resourceCount
        }}</span>
        <span>{{ pluralize(["ressource"], base?.stats.visitCount) }}</span>
      </div>
      <div class="stat">
        <span class="fr-text--xl fr-text--bold"
          >{{ base?.stats.bookmarkedCount }}x</span
        >
        <span>{{ pluralize(["favori"], base?.stats.bookmarkedCount) }}</span>
      </div>
    </div>
    <div class="fr-grid-row">
      <div
        class="fr-col-md-7 no-margin-bottom-on-last-p"
        style="
          border-right: 1px solid var(--border-default-grey);
          margin-right: 62px;
          padding-right: 62px;
        "
        v-html="base?.description"
      ></div>
      <div class="fr-col-md-4">
        <DsfrTags
          v-if="participantTypes.length"
          :tags="participantTypes"
          class="fr-mr-3w participant-tags fr-mb-2w"
        />
        <div v-if="territory" class="territory fr-py-1w" style="display: flex">
          <VIcon class="fr-mr-2v" name="ri-map-pin-line" />
          {{ territory }}
        </div>
        <div v-if="base?.website">
          <a
            :href="base.website"
            target="_blank"
            class="no-underline no-append-ico"
          >
            <DsfrButton
              :label="websiteLabel"
              icon="ri-link"
              class="fr-btn--tertiary-no-outline fr-pl-0"
            />
          </a>
        </div>
        <div v-if="base?.nationalCartographyWebsite">
          <a
            :href="base.nationalCartographyWebsite"
            target="_blank"
            class="no-underline no-append-ico"
          >
            <DsfrButton
              label="www.cartographie-nationale.gouv"
              icon="france"
              class="fr-btn--tertiary-no-outline fr-pl-0"
            />
          </a>
        </div>
        <div style="margin-left: -4px">
          <a
            v-for="link in socialMediaLinks"
            :key="link.iconName"
            class="fr-btn fr-btn--tertiary-no-outline fr-px-1v"
            :href="link.link"
            target="_blank"
          >
            <VIcon scale="1.1" :name="`ri-${link.iconName}-line`" />
          </a>
        </div>
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-5w">
      <div class="fr-col-sm-6">
        <button
          class="fr-btn select-type-btn"
          @click="currentTab = 'resources'"
        >
          <img src="/img/home/resource-blue.svg" alt="" />
          <span class="fr-text--xl">Voir les fiches</span>
          <VIcon name="ri-arrow-right-line" />
        </button>
      </div>
      <div class="fr-col-sm-6">
        <button
          class="fr-btn select-type-btn"
          @click="currentTab = 'collections'"
        >
          <img src="/img/home/collection-blue.svg" alt="" />
          <span class="fr-text--xl">Voir les collections</span>
          <VIcon name="ri-arrow-right-line" />
        </button>
      </div>
    </div>

    <hr class="fr-pb-4w fr-mt-4w" />

    <div
      v-if="base?.canWrite"
      style="display: flex; justify-content: flex-end"
      class="fr-mb-3v"
    >
      <IntroTooltip slug="NEW_BASE_SECTIONS">
        <DsfrButton
          label="Rubriques à la une"
          secondary
          icon="ri-add-line"
          class="fr-btn--sm"
          @click="showBaseSection = true"
        />
      </IntroTooltip>
    </div>

    <template v-if="base.showLatestAdditions && base.latestAdditions.length">
      <h2 class="fr-h3 fr-mb-5w">Derniers ajouts</h2>
      <div class="resource-grid">
        <ResourceMiniatureById
          v-for="resourceId of base.latestAdditions"
          :key="resourceId"
          :resource-id="resourceId"
        />
      </div>
    </template>

    <template v-if="base.sections?.length">
      <BaseSection
        v-for="sectionId in base.sections"
        :key="sectionId"
        :section="baseSectionStore.baseSectionsById[sectionId]"
      />
    </template>
    <BaseEditSection
      v-if="showBaseSection"
      @close="showBaseSection = false"
      @save="updateBase"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useBaseStore } from "~/stores/baseStore"
import { useTagStore } from "~/stores/tagStore"
import { useRouter } from "vue-router"
import { useBaseSectionStore } from "~/stores/baseSectionStore"
import { DsfrButton } from "@gouvminint/vue-dsfr"

const baseStore = useBaseStore()
const baseSectionStore = useBaseSectionStore()
const tagStore = useTagStore()
const router = useRouter()
const route = useRoute()
const showBaseSection = ref(false)

const base = computed(() => {
  return baseStore.current
})
const participantTypes = computed<{ label: string }[]>(
  () =>
    base.value?.participantTypeTags?.map((tagId: number) => {
      return { label: tagStore.tagsById[tagId]?.name }
    }) || []
)
const currentTab = computed<"presentation" | "resources" | "collections">({
  get: () =>
    <"presentation" | "resources" | "collections" | "">route.query.tab ||
    "presentation",
  set: (type: "presentation" | "resources" | "collections") =>
    router.push({ query: { ...route.query, tab: type } }),
})
const territory = computed<string>(() =>
  (
    base.value?.territoryTags?.map((id) => tagStore.tagsById[id].name) || []
  ).join(", ")
)
const websiteLabel = computed<string>(() => {
  const url = base.value?.website
  if (url == null) {
    return ""
  }
  if (url.length < 45) {
    return url
  }
  return url.slice(0, 45 - 3) + "..."
})
const socialMediaLinks = computed<{ link: string; iconName: string }[]>(() => {
  const links: { link: string; iconName: string }[] = []
  for (const socialMedia of ["twitter", "linkedin", "facebook", "mastodon"]) {
    const capitalized =
      socialMedia.slice(0, 1).toUpperCase() + socialMedia.slice(1)
    // @ts-ignore
    const url: string = <string>base.value[`socialMedia${capitalized}`]
    if (url) {
      links.push({
        link: url,
        iconName: socialMedia === "facebook" ? "facebook-circle" : socialMedia,
      })
    }
  }
  return links
})
async function updateBase(data: any) {
  const { error } = await baseStore.update(data)
  if (!error.value) {
    showBaseSection.value = false
  }
}
</script>

<style scoped>
.select-type-btn {
  font-weight: bold;
  text-align: center;
  width: 100%;
  border-radius: 12px;
  display: inline-block;
  padding: 11px 0;
}
.select-type-btn img {
  vertical-align: middle;
  height: 32px;
  position: relative;
  bottom: 3px;
}
.select-type-btn span {
  margin-left: 24px;
  margin-right: 12px;
}
</style>
