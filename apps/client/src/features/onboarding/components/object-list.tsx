import { useCallback, useMemo } from 'react'

import { ObjectIcon } from '../../../shared/components/object-icon'
import { useStagesStore } from '../hooks/stores/use-stages-store'
import { useDraggable } from '../hooks/use-draggable'

import { cn } from '@/lib/utils'
import { Separator } from '@/shared/components/ui/separator'
import { useQuery } from '@/shared/hooks/use-query'

interface ObjectListProperties {
  imageZone: HTMLDivElement | undefined
}

export function ObjectList({ imageZone }: ObjectListProperties) {
  const remoteObjects = useQuery().objects()
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

  const sensors = useMemo(() => {
    return objects.filter((object) => true) // TODO
  }, [objects])

  const actions = useMemo(() => {
    return objects.filter((object) => false) // TODO
  }, [objects])

  return <div className="p-6 overflow-auto rounded-lg bg-card
  text-card-foreground scrollbar scrollbar-thumb-card-foreground scrollbar-w-1
  scrollbar-thumb-rounded-lg scrollbar-track-transparent">
    <h3 className='text-lg font-semibold leading-7'>
      Objets disponibles
    </h3>
    <div className="mt-4 space-y-4 w-[20ch]">
      {
        actions.length > 0 && (
          <>
            <h4 className="text-xs font-medium leading-tight text-muted">
              Actionneurs
            </h4>
            {actions.map((action) => {
              if (action.objectId === undefined) {
                return
              }

              return action.isAvailable && (
                <ObjectListItem
                  key={action.objectId}
                  imageZone={imageZone}
                  object={action}
                />
              )
            })}
            <Separator />
          </>
        )
      }
      {
        sensors.length > 0 && (
          <>
            <h4 className="text-xs font-medium leading-tight
            text-muted-foreground">
              Capteurs
            </h4>
            {sensors.map(({ ...sensor }) => {
              if (sensor.objectId === undefined) {
                return
              }

              return sensor.isAvailable && (
                <ObjectListItem
                  key={sensor.objectId}
                  imageZone={imageZone}
                  object={sensor}
                />
              )
            })}
          </>
        )
      }
    </div>
  </div>
}

interface ObjectListItemProperties {
  imageZone: HTMLDivElement | undefined
  object: ReturnType<ReturnType<typeof useQuery>['objects']>[number]
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
    <span
      className="w-full text-sm font-medium leading-normal truncate"
      title={object.name}
    >
      {object.name}
    </span>
  </div>
}
