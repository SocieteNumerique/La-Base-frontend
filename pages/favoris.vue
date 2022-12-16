<template>
  <div>
    <div class="fr-mb-4w fr-container fr-p-0">
      <h1 class="fr-h2 fr-mb-5w">Mes bases favorites</h1>

      <div v-if="baseStore.bookmarks.length">
        <div
          style="display: flex; justify-content: space-between"
          class="fr-mb-4w"
        >
          <div
            v-if="baseStore.bookmarks.length > 3"
            class="fr-search-bar fr-input-group"
          >
            <input
              id="search"
              v-model="textInput"
              class="fr-input"
              type="text"
              placeholder="Filtrer parmi mes bases favorites"
              style="width: 308px"
            />
            <button class="fr-btn">
              <VIcon name="ri-search-line" />
            </button>
          </div>
          <div>{{ baseStore.bookmarks.length }} bases favorites</div>
        </div>

        <div class="bases-holder">
          <template v-if="results.length">
            <BaseMiniature
              v-for="base of results"
              :key="base.id"
              :base="base"
            />
          </template>
          <p v-else>
            Aucune base ne contient "{{ textInput }}" dans son titre.
          </p>
        </div>
      </div>
      <div v-else>
        Vous n’avez pas encore ajouté de bases à vos favoris..
        <div class="fr-mt-2w">
          <NuxtLink to="/recherche?dataType=bases" class="no-underline">
            <DsfrButton
              label="Rechercher des bases"
              class="fr-btn--secondary"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBaseStore } from "~/stores/baseStore"
import { DsfrButton } from "@gouvminint/vue-dsfr"
import { Base } from "~/composables/types"

const textInput = ref("")
const results = computed<Base[]>(() => {
  const bases = baseStore.bookmarks
  const inputLower = textInput.value.toLowerCase()
  if (!textInput.value) {
    return bases
  }
  return bases.filter(
    (base) => base.title.toLowerCase().indexOf(inputLower) !== -1
  )
})
const baseStore = useBaseStore()
</script>
