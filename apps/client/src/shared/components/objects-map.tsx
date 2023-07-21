import { useMemo, useState, useEffect, useRef, useCallback } from 'react'

import { useImageZone } from '@/features/onboarding/hooks/use-image-zone'
import type { Stage } from '@/features/onboarding/types/stage'
import { ObjectIcon } from '@/shared/components/object-icon'

interface ObjectsMapProperties {
  mapImage: Blob
  objects: Stage['objects']
  getImageZone?: (imageZone: HTMLDivElement | undefined) => void
  editable?: false | {
    updateObject: (object: Stage['objects'][number]) => void
  }
  colorizeObjects?: boolean
  openModalOnObjectClick?: boolean
}

export function ObjectsMap(properties: ObjectsMapProperties) {
  if (properties.mapImage === undefined) {
    throw new Error('No map image')
  }

  const mapImageUrl = useMemo(() => {
    return URL.createObjectURL(properties.mapImage)
  }, [properties.mapImage])

  const [mapImageAspectRatio, setMapImageAspectRatio] = useState<number>()
  useEffect(() => {
    createImageBitmap(properties.mapImage).then((bitmap) => {
      setMapImageAspectRatio(bitmap.width / bitmap.height)
    })
  }, [properties.mapImage])

  const [
    imageZone,
    { referenceFullWidthImageZone, referenceFullHeightImageZone },
  ] = useImageZone()

  useEffect(() => {
    if (properties.getImageZone !== undefined) {
      properties.getImageZone(imageZone)
    }
  }, [imageZone, properties.getImageZone])

  return (
    <div className='flex justify-center items-center flex-1 overflow-hidden'>
      <div
        style={{ backgroundImage: `url(${mapImageUrl})` }}
        className='bg-center bg-no-repeat bg-contain overflow-hidden
                     w-full h-full flex relative'
      >
        {/* The following divs are used to get the real image zone */}
        <div
          className='absolute w-full top-1/2 left-1/2
            transform -translate-y-1/2 -translate-x-1/2'
          style={{ aspectRatio: mapImageAspectRatio }}
          ref={referenceFullWidthImageZone}
        />
        <div
          className='absolute h-full top-1/2 left-1/2
            transform -translate-y-1/2 -translate-x-1/2'
          style={{ aspectRatio: mapImageAspectRatio }}
          ref={referenceFullHeightImageZone}
        />
        <ImageZone
          imageZone={imageZone}
          objects={properties.objects}
          editable={
            properties.editable !== undefined &&
            properties.editable !== false
          }
          updateObject={(object) => {
            if (
              typeof properties.editable === 'object' &&
              properties.editable.updateObject !== undefined
            ) {
              properties.editable.updateObject(object)
            }
          }}
          colorizeObjects={properties.colorizeObjects ?? false}
          openModalOnObjectClick={properties.openModalOnObjectClick ?? false}
        />
      </div>
    </div>
  )
}

function ImageZone({
  imageZone, objects, updateObject, editable,
  colorizeObjects, openModalOnObjectClick,
}: {
  imageZone: HTMLDivElement | undefined
  objects: Stage['objects']
  updateObject: (object: Stage['objects'][number]) => void
  editable: boolean
  colorizeObjects: boolean
  openModalOnObjectClick: boolean
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
            object.emplacement && <ObjectMapItem
              key={index}
              object={object}
              updateObject={updateObject}
              editable={editable}
              colorize={colorizeObjects}
              openModalOnObjectClick={openModalOnObjectClick}
            />
          )
        })
      }
    </div>
  </div>
}

function ObjectMapItem({
  object,
  updateObject,
  editable,
  colorize,
  openModalOnObjectClick,
}: {
  object: Stage['objects'][number]
  updateObject: (object: Stage['objects'][number]) => void
  editable: boolean
  colorize: boolean
  openModalOnObjectClick: boolean
}) {
  const dragging = useRef(false)

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

      const newEmplacement = [x, y] as [number, number]
      const newObject = { ...object, emplacement: newEmplacement }

      updateObject(newObject)
      object.emplacement = newEmplacement

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
      {...(editable ? { ref: objectReference } : {})}
    >
      <ObjectIcon
        object={object}
        className={editable ? 'cursor-grab active:cursor-grabbing' : ''}
        colorize={colorize}
        openModalOnClick={openModalOnObjectClick}
      />
    </div>
  )
}
