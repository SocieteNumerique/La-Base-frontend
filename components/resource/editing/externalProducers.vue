<template>
  <div>
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
      <div class="fr-mt-2w">
        <DsfrButton
          :label="label"
          secondary
          class="fr-btn--sm"
          icon="ri-add-circle-line"
          @click="showExternalProducersModal = true"
        />
        <hr class="fr-mt-3w" />
      </div>
    </div>

    <DsfrModal
      v-if="showExternalProducersModal"
      opened
      :actions="addExternalProducerActions"
      title="Ajouter un producteur"
      @close="onNewExternalProducerModalClose"
    >
      <DsfrInputGroup
        v-model="newExternalProducer.name"
        hint="Le nom du producteur sera visible sur la ressource"
        label="Nom du producteur"
        :label-visible="true"
        placeholder="Hakim Dupont"
      />
      <DsfrInputGroup
        v-model="newExternalProducer.websiteUrl"
        hint="Si le producteur possède un site internet, vous pouvez le renseigner ici"
        label="Site internet"
        :label-visible="true"
        placeholder="http://site-internet.fr"
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
        source="own"
        @change="onNewExternalProducerTagChange"
      />
    </DsfrModal>
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { useTagStore } from "~/stores/tagStore"
import { ExternalProducer, Tag } from "~/composables/types"

const resourceStore = useResourceStore()
const tagStore = useTagStore()
const newExternalProducer = ref<ExternalProducer>({
  name: "",
  emailContact: "",
  occupation: undefined,
  websiteUrl: "",
})

const showExternalProducersModal = ref(false)

const producerState = computed(() => resourceStore.current?.producerState)
const label = computed(() => {
  if (producerState.value == "know") {
    return "Ajouter un producteur"
  }
  if (producerState.value == "me") {
    return "Ajouter un co-producteur"
  }
})

const isAddExternalProducerDisabled = computed(() => {
  newExternalProducer.value.name
  newExternalProducer.value.occupation
  const extProd = newExternalProducer.value
  return !extProd.name || !extProd.occupation
})

const resetNewProducer = () => {
  showExternalProducersModal.value = false
  newExternalProducer.value = {
    name: "",
    emailContact: "",
    occupation: undefined,
    websiteUrl: "",
  }
}

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
  resetNewProducer()
}

const addExternalProducerActions = computed(() => {
  return [
    {
      label: "Valider",
      onClick: onExternalProducersAdd,
      disabled: isAddExternalProducerDisabled.value,
    },
  ]
})

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
  resetNewProducer()
}

// const externalProducerHint = "Si le producteur possède déjà un compte sur la plateforme, il sera directement crédité sur la ressource. Sinon, il sera invité à créer son compte."
const externalProducerHint = ""
</script>
