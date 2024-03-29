import { useCallback, useState } from 'react'

import { useStagesStore } from '../hooks/stores/use-stages-store'

import { cn } from '@/lib/utils'

export function DropMap() {
  const [isOver, setIsOver] = useState(false)
  const currentStageIndex = useStagesStore((state) => state.currentStageIndex)
  const updateStage = useStagesStore((state) => state.updateStage)
  const setMapImage = useCallback((image: Blob) => {
    updateStage(currentStageIndex, { image })
  }, [currentStageIndex, updateStage])

  const onDragEnter = useCallback(() => {
    setIsOver(true)
  }, [])

  const onDragLeave = useCallback(() => {
    setIsOver(false)
  }, [])

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!isOver) {
      setIsOver(true)
    }

    event.preventDefault()
  }, [isOver])

  const onDropCallback = useCallback((
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault()
    setIsOver(false)

    const files = event.dataTransfer.files

    if (files.length === 0) {
      return
    }

    if (files.length > 1) {
      console.warn('Only one file is supported.')
      return
    }

    const file = files[0]
    if (!file) {
      return
    }

    setMapImage(file)
  }, [setMapImage])

  return (
    <div
      className={
        cn(
          'rounded-lg p-6 flex-1 flex flex-col justify-center items-center',
          isOver ? 'bg-muted' : 'bg-muted/50',
        )
      }
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDropCallback}
    >
      <div className="contents pointer-events-none">
        <div className="w-full h-full border-2 border-dashed
        border-muted-foreground
        rounded-[calc(theme(borderRadius.lg)-theme(padding.6))]
        p-6 flex flex-col justify-center items-center flex-1">
          {isOver
            ? <p className="text-muted-foreground">Lâchez votre plan ici</p>
            : <p className="text-muted-foreground">Déposez votre plan ici</p>
          }
        </div>
      </div>
    </div>
  )
}
