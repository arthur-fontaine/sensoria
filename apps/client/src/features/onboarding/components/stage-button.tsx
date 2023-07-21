import type { PropsWithChildren } from 'react'

import { useStagesStore } from '../hooks/stores/use-stages-store'
import type { Stage } from '../types/stage'

import { cn } from '@/lib/utils'

interface StageButtonProperties {
  onClick?: () => void
  selected?: boolean
}

export function StageButton(
  {
    children,
    stage,
    onClick,
    selected,
  }: (
      | PropsWithChildren<StageButtonProperties & { stage?: never }>
      | StageButtonProperties & { children?: never, stage: Stage }
    ),
) {
  const { stageIndex, selectedStageIndex, selectStage } = selected === undefined
    ? useStagesStore(
      (state) => ({
        stageIndex: stage === undefined ? -1 : state.stages.indexOf(stage),
        selectedStageIndex: state.currentStageIndex,
        selectStage: state.selectStage,
      }),
    )
    : ({} as Record<string, undefined>)

  const stageItemStyle = 'flex items-center justify-center ' +
    'py-12 px-4 h-0 aspect-square bg-card rounded-lg select-none ' +
    'text-card-foreground'

  return (
    <div
      className={cn(
        stageItemStyle,
        (!selected || stageIndex !== selectedStageIndex)
        && 'bg-muted text-muted-foreground',
      )}
      onClick={
        onClick === undefined && stageIndex !== -1
          ? () => selectStage?.(stageIndex!)
          : onClick
      }
    >
      <span className='w-full truncate text-center'>
        {
          stage === undefined
            ? children
            : (stage.name.length === 0
              ? '\u00A0'
              : stage.name)
        }
      </span>
    </div>
  )
}
