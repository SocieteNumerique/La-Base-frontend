import { defineStore } from 'pinia'
import { Resource } from '~/composables/types'

type ResourceState = {
  creationStepIndex: number
  current: Resource
  new: Resource
}

const CREATION_STEPS = ['publish_as', 'init_general_info', 'general_info']

export const useResourceStore = defineStore('resource', {
  state: () =>
    <ResourceState>{
      creationStepIndex: 0,
      current: {
        id: null,
        baseId: null,
        title: '',
        content: '',
        author: null,
      },
      new: {
        id: null,
        baseId: null,
        title: '',
        content: '',
        author: null,
      },
    },
  actions: {
    async incrementCreationStep() {
      this.creationStepIndex = Math.min(
        CREATION_STEPS.length - 1,
        this.creationStepIndex + 1
      )
    },
    async decrementCreationStep() {
      this.creationStepIndex = Math.max(0, this.creationStepIndex - 1)
    },
  },
  getters: {
    creationStep: (state) => {
      return CREATION_STEPS[state.creationStepIndex]
    },
  },
})
