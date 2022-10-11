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
              class="btn--no-border"
              icon="ri-edit-line"
              @click="showOwnBaseModal = true"
            />
          </div>

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
          <div>
            <div
              v-for="producer of resourceStore.current?.externalProducers || []"
              :key="producer.emailContact"
              class="has-children-space-between"
              style="align-items: center"
            >
              <div>{{ producer.name }}</div>
              <div>
                <DsfrButton
                  label="Supprimer"
                  secondary
                  class="btn--no-border"
                  icon="ri-delete-bin-line"
                  @click="removeProducer(producer.emailContact)"
                />
              </div>
            </div>
            <div v-if="resourceStore.current?.producerState === 'know'">
              <DsfrButton
                label="Ajouter un producteur"
                secondary
                class="btn--no-border"
                icon="ri-add-circle-line"
                @click="showExternalProducersModal = true"
              />
            </div>
          </div>

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
      <DsfrModal
        v-if="showExternalProducersModal"
        opened
        :actions="addExternalProducerActions"
        title="Ajouter un producteur"
        @close="onNewExternalProducerModalClose"
      >
        <DsfrInput
          :model-value="newExternalProducer.name"
          hint="Le nom du producteur sera visible sur la ressource"
          label="Nom du producteur"
          :label-visible="true"
          @update:model-value="onNewExternalProducerName"
        />
        <!--        <div class="fr-mt-3w">-->
        <!--          <DsfrInput-->
        <!--            :model-value="newExternalProducer.emailContact"-->
        <!--            label="Contact mail"-->
        <!--            :hint="externalProducerHint"-->
        <!--            type="email"-->
        <!--            :label-visible="true"-->
        <!--            @update:model-value="onNewExternalProducerEmailContact"-->
        <!--          />-->
        <!--        </div>-->

        <TagSelector
          v-if="tagStore.categoryBySlug('externalProducer_00occupation')"
          class="fr-mt-3w"
          :category="tagStore.categoryBySlug('externalProducer_00occupation')"
          :is-focused="true"
          @change="onNewExternalProducerTagChange"
        />
      </DsfrModal>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useBaseStore } from "~/stores/baseStore"
import { useResourceStore } from "~/stores/resourceStore"
import { ExternalProducer, Tag } from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"
import { DsfrButton } from "@gouvminint/vue-dsfr"

const baseStore = useBaseStore()
const resourceStore = useResourceStore()
const tagStore = useTagStore()

const showOwnBaseModal = ref(false)
const showExternalProducersModal = ref(false)
const ownSelectedBase = ref(-1)
const newExternalProducer = ref<ExternalProducer>({
  name: "",
  emailContact: "",
  occupation: undefined,
})

const isAddExternalProducerDisabled = computed(() => {
  newExternalProducer.value.name
  newExternalProducer.value.occupation
  const extProd = newExternalProducer.value
  return !extProd.name || !extProd.occupation
})

const removeProducer = (producerEmail: string) => {
  console.log(
    "### remove producer",
    producerEmail,
    resourceStore.current?.externalProducers
  )
  let producers = resourceStore.current?.externalProducers || []
  producers = producers.filter(
    (producer: ExternalProducer) => producer.emailContact !== producerEmail
  )
  resourceStore.resourcesById[resourceStore.currentId!].externalProducers =
    producers
  resourceStore.markDirty()
}

const onOwnBaseChose = () => {
  showOwnBaseModal.value = false
  resourceStore.resourcesById[resourceStore.currentId!].creator =
    ownSelectedBase.value
  resourceStore.markDirty()
  console.log("### selected", ownSelectedBase)
}
const onExternalProducersAdd = () => {
  console.log("### added")
  if (
    resourceStore.resourcesById[resourceStore.currentId!].externalProducers ==
    null
  ) {
    resourceStore.resourcesById[resourceStore.currentId!].externalProducers = []
  }
  // @ts-ignore
  resourceStore.resourcesById[resourceStore.currentId!].externalProducers.push({
    ...newExternalProducer.value,
  })
  resourceStore.markDirty()
  showExternalProducersModal.value = false
}
const ownBaseModalActions = [
  {
    label: "Valider",
    onClick: onOwnBaseChose,
  },
]
const addExternalProducerActions = computed(() => {
  return [
    {
      label: "Valider",
      onClick: onExternalProducersAdd,
      disabled: isAddExternalProducerDisabled.value,
    },
  ]
})

const selectProducer = (producer: string) => {
  console.log(
    "### select producer",
    producer,
    resourceStore.resourcesById,
    resourceStore.currentId
  )
  resourceStore.resourcesById[resourceStore.currentId!].producerState = producer
  resourceStore.markDirty()
  if (producer === "me") {
    showOwnBaseModal.value = true
  }
  if (producer === "know") {
    showExternalProducersModal.value = true
  }

  // reset values if we've changed something
  if (producer != "me") {
    ownSelectedBase.value = -1
    resourceStore.resourcesById[resourceStore.currentId!].creator = undefined
  }
  if (producer != "know") {
    resourceStore.resourcesById[resourceStore.currentId!].externalProducers = []
  }
}

const onNewExternalProducerName = (value: string) => {
  newExternalProducer.value.name = value
  // isAddExternalProducerDisabled.value
}

const onNewExternalProducerEmailContact = (value: string) => {
  newExternalProducer.value.emailContact = value
  // isAddExternalProducerDisabled.value
}
const onNewExternalProducerTagChange = (value: Tag[]) => {
  if (value.length) {
    newExternalProducer.value.occupation = value[0].id
  } else {
    newExternalProducer.value.occupation = undefined
  }
  console.log(
    "### onNewExternalProducerTagChange",
    newExternalProducer.value.occupation
  )
  // isAddExternalProducerDisabled.value
}

const onNewExternalProducerModalClose = () => {
  if (!resourceStore.current?.externalProducers?.length) {
    resourceStore.resourcesById[resourceStore.currentId!].producerState = ""
  }
  showExternalProducersModal.value = false
}

// const externalProducerHint = "Si le producteur possède déjà un compte sur la plateforme, il sera directement crédité sur la ressource. Sinon, il sera invité à créer son compte."
const externalProducerHint = ""
</script>
