import { useState, useEffect, useCallback, useRef } from 'react'

import { ObjectIcon } from './object-icon'
import { useStagesStore } from '../hooks/stores/use-stages-store'
import type { Stage } from '../types/stage'

export function ObjectsMap({ imageZone, objects }: {
  imageZone: HTMLDivElement | undefined
  objects: Stage['objects']
}) {
  const [height, setHeight] = useState<number>()
  const [width, setWidth] = useState<number>()
  const [resizeObserver, setResizeObserver] = useState<ResizeObserver>()

  useEffect(() => {
    if (imageZone === undefined) {
      return
    }

    resizeObserver?.disconnect()

    const newResizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      setHeight(entry?.contentRect.height)
      setWidth(entry?.contentRect.width)
    })

    newResizeObserver.observe(imageZone)
    setResizeObserver(resizeObserver)

    return () => {
      newResizeObserver.disconnect()
    }
  }, [imageZone, resizeObserver])

  return <div className='w-full h-full flex items-center justify-center'>
    <div
      className='relative'
      style={{ height, width }}
    >
      {
        objects.map((object, index) => {
          return (
            object.emplacement && <ObjectMapItem key={index} object={object} />
          )
        })
      }
    </div>
  </div>
}

function ObjectMapItem({ object }: { object: Stage['objects'][number] }) {
  const dragging = useRef(false)

  const currentStageIndex = useStagesStore((state) => state.currentStageIndex)
  const updateStage = useStagesStore((state) => state.updateStage)
  const updateObject = useCallback((object: Stage['objects'][number]) => {
    updateStage(currentStageIndex, {
      objects: [object],
    })
  }, [updateStage, currentStageIndex])

  const [eventRemovers, setEventRemovers] = useState<(() => void)[]>([])
  const addEventRemover = useCallback((remover: () => void) => {
    setEventRemovers((previous) => [...previous, remover])
  }, [])
  const removeEvents = useCallback(() => {
    for (const remover of eventRemovers) {
      remover()
    }
  }, [eventRemovers])

  const objectReference = useCallback((node: HTMLDivElement | null) => {
    if (node === null) {
      return
    }

    const imageZone = node.parentElement

    if (imageZone === undefined || imageZone === null) {
      return
    }

    const mouseMoveListener = (event: MouseEvent) => {
      if (!dragging.current) {
        return
      }

      const imageZoneRect = imageZone.getBoundingClientRect()

      const x = (event.clientX - imageZoneRect.left) / imageZoneRect.width
      const y = (event.clientY - imageZoneRect.top) / imageZoneRect.height

      if (x < 0 || x > 1 || y < 0 || y > 1) {
        return
      }

      object.emplacement = [x, y]
      node.style.top = `${y * 100}%`
      node.style.left = `${x * 100}%`
    }

    const mouseDownListener = () => {
      dragging.current = true
      imageZone?.addEventListener('mousemove', mouseMoveListener)
    }

    const mouseUpListener = () => {
      dragging.current = false
      updateObject(object)
      imageZone?.removeEventListener('mousemove', mouseMoveListener)
    }

    node.addEventListener('mousedown', mouseDownListener)
    addEventRemover(() => {
      node.removeEventListener('mousedown', mouseDownListener)
    })
    addEventRemover(() => {
      imageZone?.removeEventListener('mousemove', mouseMoveListener)
    })
    document.addEventListener('mouseup', mouseUpListener)
    addEventRemover(() => {
      document.removeEventListener('mouseup', mouseUpListener)
    })
  }, [object.emplacement])

  useEffect(() => {
    return removeEvents
  }, [removeEvents])

  return object.emplacement && (
    <div
      className='absolute -translate-x-1/2 -translate-y-1/2'
      style={{
        top: `${object.emplacement[1] * 100}%`,
        left: `${object.emplacement[0] * 100}%`,
      }}
      ref={objectReference}
    >
      <ObjectIcon
        object={object}
        className='cursor-grab active:cursor-grabbing'
      />
    </div>
  )
}
