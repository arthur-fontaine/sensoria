import type { Stage } from '../types/stage'

export const createStage = (
  newStage: Partial<Stage>,
  currentStages: Stage[],
) => {
  let maximum: number | undefined
  for (const stage of currentStages) {
    const parsed = Number(stage.name)

    if (Number.isNaN(parsed)) {
      maximum = undefined
      break
    }

    if (maximum === undefined || parsed > maximum) {
      maximum = parsed
    }
  }

  const defaultStage: Stage = {
    name: typeof maximum === 'number' ? String(maximum + 1) : '0',
    image: undefined,
    objects: [],
  }

  return {
    ...defaultStage,
    ...newStage,
  }
}
