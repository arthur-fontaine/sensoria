import { useCallback, useEffect, useMemo } from 'react'

import { ObjectIcon } from './object-icon'
import { useStagesStore } from '../hooks/stores/use-stages-store'
import { useDraggable } from '../hooks/use-draggable'

import { cn } from '@/lib/utils'
import { useQuery } from '@/shared/hooks/use-query'

interface ObjectListProperties {
  imageZone: HTMLDivElement | undefined
}

export function ObjectList({ imageZone }: ObjectListProperties) {
  const remoteObjects = useQuery().objects
  const localObjects = useStagesStore((state) =>
    state.stages[state.currentStageIndex]?.objects ?? [])

  const objects = useMemo(() => {
    return remoteObjects.map((remoteObject) => {
      const localObject = localObjects.find((localObject) => {
        return localObject.objectId === remoteObject.objectId
      })

      if (localObject === undefined) {
        return remoteObject
      }

      return {
        ...remoteObject,
        ...localObject,
      }
    })
  }, [remoteObjects, localObjects])

  return <div className="bg-card text-card-foreground
                         rounded-lg p-6 overflow-auto">
    <h3>Objets disponibles</h3>
    <div className="mt-4 space-y-4 w-[20ch]">
      {objects.map((object) => {
        if (object.objectId === undefined) {
          return
        }

        return object.isAvailable && (
          <ObjectListItem
            key={object.objectId}
            imageZone={imageZone}
            object={object}
          />
        )
      })}
    </div>
  </div>
}

interface ObjectListItemProperties {
  imageZone: HTMLDivElement | undefined
  object: ReturnType<typeof useQuery>['objects'][number]
}

function ObjectListItem({ imageZone, object }: ObjectListItemProperties) {
  const currentStageIndex = useStagesStore((state) => state.currentStageIndex)
  const updateStage = useStagesStore((state) => state.updateStage)
  const addObject = useCallback(
    (emplacement: [number, number]) => {
      // FIXME: sometimes all properties of `object` are undefined
      updateStage(currentStageIndex, {
        objects: [
          {
            objectId: object.objectId,
            iconName: object.iconName,
            name: object.name,
            emplacement,
          },
        ],
      })
    },
    [currentStageIndex, updateStage, object],
  )

  const handleDragEnd = useCallback(
    (event: MouseEvent) => {
      if (imageZone === undefined) {
        return
      }

      const imageZoneRect = imageZone.getBoundingClientRect()
      const imageZonePageX = imageZoneRect.left + window.scrollX
      const imageZonePageY = imageZoneRect.top + window.scrollY

      const xPercentage = (
        event.pageX - imageZonePageX
      ) / imageZone.offsetWidth
      const yPercentage = (
        event.pageY - imageZonePageY
      ) / imageZone.offsetHeight

      if (
        xPercentage < 0 || xPercentage > 1
        || yPercentage < 0 || yPercentage > 1
      ) {
        return
      }

      addObject([xPercentage, yPercentage])
    },
    [imageZone, addObject],
  )

  const handleDragStart = useCallback(
    (_event: MouseEvent, clone: HTMLDivElement) => {
      // `active:cursor-grabbing` is not applied because the real active
      // element is the original object, not the clone.
      // So we apply the cursor-grabbing class manually to the clone.
      clone.style.cursor = 'grabbing'
    },
    [],
  )

  const referenceBaseObject = useDraggable({
    onDragEnd: handleDragEnd,
    onDragStart: handleDragStart,
  })

  const disabled = object.isAvailable === false ||
    (object.emplacement !== undefined && object.emplacement !== null)

  return <div
    className={cn(
      'flex gap-2 items-center w-full',
      disabled && 'opacity-50 cursor-not-allowed',
    )}
  >
    <ObjectIcon
      object={object}
      ref={referenceBaseObject}
      className={cn(
        'cursor-grab active:cursor-grabbing',
        disabled && 'cursor-not-allowed pointer-events-none',
      )}
    />
    <span className="w-full truncate" title={object.name}>
      {object.name}
    </span>
  </div>
}
