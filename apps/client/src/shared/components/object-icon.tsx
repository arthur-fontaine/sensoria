import type { LucideIcon } from 'lucide-react'
import { forwardRef, useState, useEffect, useMemo } from 'react'

import type { Stage } from '../../features/onboarding/types/stage'

import { ObjectModal } from '@/features/dashboard/components/object-modal'
import { cn } from '@/lib/utils'

// TODO: When merging, merge importanceStyles and importanceColors
// from panel-alert-button.tsx (potentially get importanceColors from
// tailwind config)
const importanceStyles = {
  high: 'text-red-600 border-red-600',
  medium: 'text-orange-600 border-orange-600',
  normal: '',
}

const iconModules = import.meta.glob(
  '/node_modules/lucide-react/dist/esm/icons/*',
)

export const ObjectIcon = forwardRef<
  HTMLDivElement,
  {
    object: Stage['objects'][number]
    className?: string
    colorize?: boolean
    openModalOnClick?: boolean
  }
>(({ object, className, colorize, openModalOnClick }, reference) => {
  const [Icon, setIcon] = useState<LucideIcon>()

  // TODO: handle multiple thresholds
  const minimumValue = object?.thresholds?.[0]?.minimum
  const maximumValue = object?.thresholds?.[0]?.maximum
  const range = maximumValue && minimumValue ? maximumValue - minimumValue : 0
  const currentValue = object?.lastMeasure?.value

  let color: 'red' | 'orange' | undefined
  if (currentValue !== undefined) {
    if (maximumValue !== null && maximumValue !== undefined) {
      if (currentValue > maximumValue) {
        color = 'red'
      } else if (currentValue > maximumValue - range * 0.2) {
        color = 'orange'
      }
    }

    if (minimumValue !== null && minimumValue !== undefined) {
      if (currentValue < minimumValue) {
        color = 'red'
      } else if (currentValue < minimumValue + range * 0.2) {
        color = 'orange'
      }
    }
  }

  useEffect(() => {
    const iconName = object.iconName
    if (iconName !== undefined && iconName !== null) {
      const iconModule = iconModules[
        `/node_modules/lucide-react/dist/esm/icons/${iconName}.js`
      ]

      if (iconModule === undefined) {
        return
      }

      iconModule().then((module) => {
        const icon = (module as { default: LucideIcon }).default
        setIcon(icon)
      })
    }
  }, [object.iconName])

  const _ObjectIcon = useMemo(() => {
    return (
      <div
        className={cn(
          'p-2 bg-background rounded-sm border border-border',
          className,
          Icon === undefined && 'cursor-not-allowed pointer-events-none',
          colorize && color !== undefined ?
            `border-${color}-600 bg-${color}-100`
            : '',
        )}
        ref={reference}
      >
        {Icon !== undefined && <Icon className={cn(
          'w-4 h-4 pointer-events-none',
          colorize && color !== undefined && `stroke-${color}-600`,
        )} />}
      </div>
    )
  }, [Icon, className, colorize, color])

  return (
    <>
      {openModalOnClick
        ? <ObjectModal id={object.objectId}>
          {_ObjectIcon}
        </ObjectModal>
        : _ObjectIcon}
    </>
  )
})
