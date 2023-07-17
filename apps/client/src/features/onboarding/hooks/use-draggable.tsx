import { useCallback, useEffect, useRef, useState } from 'react'

// mouseMove and mouseUp events are attached to the document
// so we store a set of handlers to call when these events are triggered.
// It is used to avoid to create a new event on document each time a new
// draggable is created.
const mouseMoveHandlers = new Set<(event: MouseEvent) => void>()
const mouseUpHandlers = new Set<(event: MouseEvent) => void>()

const handleMouseMove = (event: MouseEvent) => {
  for (const handler of mouseMoveHandlers) {
    handler(event)
  }
}

const handleMouseUp = (event: MouseEvent) => {
  for (const handler of mouseUpHandlers) {
    handler(event)
  }
}

let eventsInitialized = false

export function useDraggable(
  {
    onDragStart,
    onDragEnd,
  }: {
    onDragStart?: (event: MouseEvent, node: HTMLDivElement) => void,
    onDragEnd?: (event: MouseEvent, node: HTMLDivElement) => void,
  },
) {
  const elementCloneReference = useRef<HTMLDivElement | undefined>()
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

  if (!eventsInitialized) {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    addEventRemover(() => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    })

    eventsInitialized = true
  }

  const createHandleMouseDown = useCallback(
    (node: HTMLDivElement, handleMouseMove: (event: MouseEvent) => void) => {
      return (event: MouseEvent) => {
        elementCloneReference.current = node.cloneNode(true) as typeof node
        elementCloneReference.current.style.position = 'absolute'
        elementCloneReference.current.style.top = `${event.clientY}px`
        elementCloneReference.current.style.left = `${event.clientX}px`
        elementCloneReference.current.style.transform = 'translate(-50%, -50%)'
  
        document.body.append(elementCloneReference.current)
  
        dragging.current = true
  
        mouseMoveHandlers.add(handleMouseMove)

        onDragStart?.(event, elementCloneReference.current)
      }
    },
    [onDragStart],
  )

  const createHandleMouseMove = useCallback(
    () => {
      return (event: MouseEvent) => {
        if (elementCloneReference.current === undefined || !dragging.current) {
          return
        }

        elementCloneReference.current.style.top = `${event.clientY}px`
        elementCloneReference.current.style.left = `${event.clientX}px`
      }
    },
    [],
  )

  const createHandleMouseUp = useCallback(
    (handleMouseMove: (event: MouseEvent) => void) => {
      return (event: MouseEvent) => {
        if (elementCloneReference.current === undefined || !dragging.current) {
          return
        }

        elementCloneReference.current.remove()

        dragging.current = false

        mouseMoveHandlers.delete(handleMouseMove)

        onDragEnd?.(event, elementCloneReference.current)

        elementCloneReference.current = undefined
      }
    },
    [onDragEnd],
  )

  const referenceBaseElement = useCallback((node: HTMLDivElement) => {
    if (node === null) {
      return
    }

    removeEvents()

    const handleMouseMove = createHandleMouseMove()

    const handleMouseDown = createHandleMouseDown(node, handleMouseMove)
    node.addEventListener('mousedown', handleMouseDown)
    addEventRemover(() => {
      node.removeEventListener('mousedown', handleMouseDown)
    })

    const handleMouseUp = createHandleMouseUp(handleMouseMove)
    mouseUpHandlers.add(handleMouseUp)
    addEventRemover(() => {
      mouseUpHandlers.delete(handleMouseUp)
    })
  }, [
    createHandleMouseDown,
    createHandleMouseUp,
    createHandleMouseMove,
    addEventRemover,
  ])

  useEffect(() => {
    return removeEvents
  }, [removeEvents])

  return referenceBaseElement
}
