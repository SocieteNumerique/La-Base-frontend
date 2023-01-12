<template>
  <div>
    <div class="fr-form-group">
      <fieldset class="fr-fieldset">
        <div class="fr-fieldset__content">
          <!-- i am the producer -->
          <div class="fr-radio-group" @click="selectProducer('me')">
            <input
              id="radio-1"
              :checked="resourceStore.current?.producerState === 'me'"
              type="radio"
              name="credits-choice"
            />
            <label class="fr-label" for="radio-1"
              >J’ai produit la ressource
            </label>
          </div>
          <div
            v-if="ownSelectedBase !== -1"
            class="has-children-space-between"
            style="align-items: center"
          >
            <span>{{ baseStore.basesById[ownSelectedBase].title }}</span>
            <DsfrButton
              label="Modifier"
              secondary
              class="btn--no-border fr-btn--sm"
              icon="ri-edit-line"
              @click="showOwnBaseModal = true"
            />
          </div>

          <ResourceEditingExternalProducers
            v-if="resourceStore.current?.producerState === 'me'"
          />

          <!-- i know the producer -->
          <div class="fr-radio-group" @click="selectProducer('know')">
            <input
              id="radio-2"
              :checked="resourceStore.current?.producerState === 'know'"
              type="radio"
              name="credits-choice"
            />
            <label class="fr-label" for="radio-2"
              >Je sais qui a produit la ressource
            </label>
          </div>

          <ResourceEditingExternalProducers
            v-if="resourceStore.current?.producerState === 'know'"
          />

          <!-- i don't know the producer -->
          <div class="fr-radio-group" @click="selectProducer('dont-know')">
            <input
              id="radio-3"
              :checked="resourceStore.current?.producerState === 'dont-know'"
              type="radio"
              name="credits-choice"
            />
            <label class="fr-label" for="radio-3"
              >Je ne sais pas qui a produit la ressource
            </label>
          </div>
        </div>
      </fieldset>
      <DsfrModal
        v-if="showOwnBaseModal"
        opened
        :actions="ownBaseModalActions"
        title="Je suis producteur"
        @close="showOwnBaseModal = false"
      >
        <BaseSelector v-model="ownSelectedBase" label="Créditer la base" />
      </DsfrModal>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useBaseStore } from "~/stores/baseStore"
import { useResourceStore } from "~/stores/resourceStore"
import { DsfrButton } from "@gouvminint/vue-dsfr"

const baseStore = useBaseStore()
const resourceStore = useResourceStore()

const showOwnBaseModal = ref(false)
const ownSelectedBase = ref(-1)
const onOwnBaseChose = () => {
  showOwnBaseModal.value = false
  resourceStore.resourcesById[resourceStore.currentId!].creatorBases = [
    ownSelectedBase.value,
  ]
  resourceStore.markDirty()
}

const selectProducer = (producer: string) => {
  resourceStore.resourcesById[resourceStore.currentId!].producerState = producer
  resourceStore.markDirty()
  if (producer === "me") {
    showOwnBaseModal.value = true
  }

  // reset values if we've changed something
  if (producer != "me") {
    ownSelectedBase.value = -1
    resourceStore.resourcesById[resourceStore.currentId!].creator = undefined
  }
  if (producer === "dont-know") {
    resourceStore.resourcesById[resourceStore.currentId!].externalProducers = []
  }
}

const ownBaseModalActions = [
  {
    label: "Valider",
    onClick: onOwnBaseChose,
  },
]
</script>
