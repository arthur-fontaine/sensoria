import { AlertTriangleIcon } from 'lucide-react'
import type { PropsWithChildren } from 'react'

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet'
import { useQuery } from '@/shared/hooks/use-query'

export function PanelAlert(
  // eslint-disable-next-line @typescript-eslint/ban-types
  { children }: PropsWithChildren<{}>,
) {
  const notifications = useQuery({
    prepare({ query }) {
      for (const notification of query.notifications) {
        notification.importance
      }
    },
  }).notifications

  const importanceStyles: Record<string, string> = {
    high: 'text-red-600 border-red-600',
    medium: 'text-orange-600 border-orange-600',
    normal: '',
    post_high: 'text-green-600 border-green-600',
  }

  const importanceColors: Record<string, string> = {
    high: '#DC2626',
    medium: '#EA580C',
    normal: '',
    post_high: '#16A34A',
  }

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent
          className="border-none">
          <SheetHeader
            className="mb-8">
            <SheetTitle>Alertes récentes</SheetTitle>
          </SheetHeader>
          <div >
            <ScrollArea className="h-screen px-1 pr-4 ">
              {
                notifications.length === 0 &&
                <div
                  className="flex flex-col items-center justify-center h-full"
                >
                  <span className="text-muted-foreground italic">
                    Aucune alerte
                  </span>
                </div>
              }
              {notifications.map((notif, index) => {
                const importanceStyle = importanceStyles[notif.importance] || ''
                const triangleColor = importanceColors[notif.importance]
                  || undefined
                return (
                  <Alert key={index} className={`p-6 mb-4 ${importanceStyle}`}>
                    <AlertTriangleIcon size={18}
                      color={triangleColor}
                      className='mt-3 color: inherit;' />
                    <AlertTitle className='flex justify-between mb-2'>
                      <span className='line-clamp-2'>
                        {notif.measure.measureType}
                      </span>
                      <span className='text-sm'>
                        {new Date(Number(notif.timestamp)).toLocaleDateString()}
                      </span>
                    </AlertTitle>
                    <AlertDescription className='line-clamp-4'>
                      {notif.message}
                    </AlertDescription>
                  </Alert>
                )
              })}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
