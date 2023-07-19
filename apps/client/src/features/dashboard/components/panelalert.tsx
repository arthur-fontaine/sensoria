import { AlertTriangle, BellDot } from 'lucide-react'

import { 
  Alert, 
  AlertDescription, 
  AlertTitle } from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet'
import { useQuery } from '@/shared/hooks/use-query'

export function PanelAlert() {
  const notificationsData = useQuery().notifications
  notificationsData[0]?.importance

  const importanceStyles = {
    high: 'text-red-600 border-red-600',
    medium: 'text-orange-600 border-orange-600',
    normal: '',
    post_high: 'text-green-600 border-green-600',
  }

  const importanceColors = {
    high: '#DC2626',
    medium: '#EA580C',
    normal: '',
    post_high: '#16A34A',
  }

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon"><BellDot size={24}/></Button>
        </SheetTrigger>
        <SheetContent 
          className="border-none">
          <SheetHeader 
            className="mb-8">
            <SheetTitle>Alertes récentes</SheetTitle>
          </SheetHeader>
          <div >
            <ScrollArea className="h-screen px-1 pr-4 ">
              {notificationsData.map((notif, index) => {
                const importanceStyle = importanceStyles[notif.importance] || ''
                const triangleColor = importanceColors[notif.importance] 
              || undefined
                return (
                  <Alert key={index} className={`p-6 mb-4  ${importanceStyle}`}>
                    <AlertTriangle size={18}
                      color={triangleColor} 
                      className='mt-3'/>
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
