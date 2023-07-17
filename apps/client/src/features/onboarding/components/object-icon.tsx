import type { LucideIcon } from 'lucide-react'
import { forwardRef, useState, useEffect } from 'react'

import type { Stage } from '../types/stage'

import { cn } from '@/lib/utils'

const iconModules = import.meta.glob(
  '/node_modules/lucide-react/dist/esm/icons/*',
)

export const ObjectIcon = forwardRef<
  HTMLDivElement,
  { object: Stage['objects'][number], className?: string }
>(({ object, className }, reference) => {
  const [Icon, setIcon] = useState<LucideIcon>()

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

  return <div
    className={cn(
      'p-2 bg-background rounded-sm border border-border',
      className,
      Icon === undefined && 'cursor-not-allowed pointer-events-none',
    )}
    ref={reference}
  >
    {Icon !== undefined && <Icon className="w-4 h-4 pointer-events-none" />}
  </div>
})
