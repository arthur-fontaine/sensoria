import type { PropsWithChildren } from 'react'

import { useStagesStore } from '../hooks/stores/use-stages-store'
import type { Stage } from '../types/stage'

import { cn } from '@/lib/utils'

interface StageButtonProperties {
  onClick?: () => void
}

export function StageButton(
  {
    children,
    stage,
    onClick,
  }: (
      | PropsWithChildren<StageButtonProperties & { stage?: never }>
      | StageButtonProperties & { children?: never, stage: Stage }
    ),
) {
  const stageIndex = useStagesStore(
    (state) => stage === undefined ? -1 : state.stages.indexOf(stage),
  )
  const selectedStageIndex = useStagesStore(
    (state) => state.currentStageIndex,
  )
  const selectStage = useStagesStore(
    (state) => state.selectStage,
  )

  const stageItemStyle = 'flex items-center justify-center ' +
    'p-12 bg-card rounded-lg select-none ' +
    'text-card-foreground'

  return (
    <div
      data-index={stageIndex}
      className={cn(
        stageItemStyle,
        stageIndex !== selectedStageIndex && 'bg-muted text-muted-foreground',
      )}
      onClick={
        onClick === undefined && stageIndex !== -1
          ? () => selectStage(stageIndex)
          : onClick
      }
    >
      {
        stage === undefined
          ? children
          : (stage.name.length === 0
            ? '\u00A0'
            : stage.name)
      }
    </div>
  )
}
