import { create } from 'zustand'

import type { Stage } from '../../types/stage'
import { createStage } from '../../utils/create-stage'

import type { DeepPartial } from '@/shared/types/deep-partial'

type StagesStore = {
  stages: Stage[],
  currentStageIndex: number,
  createStage: (newStage?: Partial<Stage>, autoSelect?: boolean) => void,
  updateStage: (index: number, newStage: DeepPartial<Stage>) => void,
  deleteStage: (index: number) => void,
  selectStage: (index: number) => void,
}

export const useStagesStore = create<StagesStore>((set) => ({
  stages: [],
  currentStageIndex: -1,
  createStage: (newStage, autoSelect = true) => {
    set((state) => ({
      stages: [
        ...state.stages,
        createStage(newStage ?? {}, state.stages),
      ],
      ...(autoSelect ? { currentStageIndex: state.stages.length } : {}),
    }))
  },
  updateStage: (index, updatedStage) => set((state) => {
    const toUpdateStage = state.stages[index]

    if (toUpdateStage === undefined) {
      console.error('Tried to update a stage that does not exist.')
      return state
    }

    const newStages = structuredClone(state.stages)
    newStages[index] = {
      ...toUpdateStage,
      ...updatedStage,
      objects: [
        ...toUpdateStage.objects.filter(
          (object) => !updatedStage.objects?.some(
            (updatedObject) => updatedObject?.objectId === object.objectId,
          ),
        ),
        ...updatedStage.objects ?? [],
      ],
    } as Stage

    return { stages: newStages }
  }),
  deleteStage: (index) => set((state) => {
    const newStages = structuredClone(state.stages)
    newStages.splice(index, 1)
    return { stages: newStages }
  }),
  selectStage: (index) => set({ currentStageIndex: index }),
}))
