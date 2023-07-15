import { useCallback, useEffect, useState } from 'react'

export function useImageZone() {
  const [fullWidthImageZone, setFullWidthImageZone] = useState<HTMLDivElement>()
  const [
    fullHeightImageZone, setFullHeightImageZone,
  ] = useState<HTMLDivElement>()
  const [imageZone, setFullImageZone] = useState<HTMLDivElement>()

  const referenceFullWidthImageZone = useCallback((node: HTMLDivElement) => {
    setFullWidthImageZone(node)
  }, [setFullWidthImageZone])

  const referenceFullHeightImageZone = useCallback((node: HTMLDivElement) => {
    setFullHeightImageZone(node)
  }, [setFullHeightImageZone])

  useEffect(() => {
    if (fullWidthImageZone === undefined) {
      return
    }

    if (fullHeightImageZone === undefined) {
      return
    }

    const resizeObserver = new ResizeObserver(() => {
      // get the smallest zone
      const fullWidthImageZoneArea = (
        fullWidthImageZone.clientWidth * fullWidthImageZone.clientHeight
      )
      const fullHeightImageZoneArea = (
        fullHeightImageZone.clientWidth * fullHeightImageZone.clientHeight
      )

      if (fullWidthImageZoneArea < fullHeightImageZoneArea) {
        if (imageZone !== fullWidthImageZone) {
          setFullImageZone(fullWidthImageZone)
        }
      } else {
        if (imageZone !== fullHeightImageZone) {
          setFullImageZone(fullHeightImageZone)
        }
      }
    })

    // only observe the full width image zone because if this one is resized,
    // the full height image zone will be too
    resizeObserver.observe(fullWidthImageZone)

    return () => {
      resizeObserver.disconnect()
    }
  }, [
    imageZone,
    fullWidthImageZone,
    fullHeightImageZone,
  ])

  // Uncomment this to see the image zones
  // useEffect(() => {
  //   if (fullHeightImageZone !== undefined) {
  //     fullHeightImageZone.style.pointerEvents = 'none'
  //     fullHeightImageZone.style.visibility = 'hidden'
  //   }

  //   if (fullWidthImageZone !== undefined) {
  //     fullWidthImageZone.style.pointerEvents = 'none'
  //     fullWidthImageZone.style.visibility = 'hidden'
  //   }

  //   if (imageZone !== undefined) {
  //     imageZone.style.background = 'red'
  //     imageZone.style.opacity = '0.5'
  //     imageZone.style.pointerEvents = 'none'
  //     imageZone.style.visibility = 'visible'
  //   }
  // }, [imageZone])

  return [
    imageZone,
    {
      referenceFullWidthImageZone,
      referenceFullHeightImageZone,
    },
  ] as const
}
