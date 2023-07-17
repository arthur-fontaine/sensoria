import { Label } from '@radix-ui/react-label'
import { BatteryMedium } from 'lucide-react'

import { Input } from './ui/input'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'
import { useQuery } from '@/hooks/use-query'

interface ModalProperties {
  id: number;
}

export function Modal(properties: ModalProperties) {
  const [object] = useQuery().objects({ id: properties.id })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{object?.iconName}</Button>
      </DialogTrigger>
      <DialogContent className="gap-0 sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-end gap-3">
            <DialogTitle className="text-xl">{object?.name}</DialogTitle>
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <BatteryMedium />
              {object?.batteryLevel}%
            </div>
          </div>
          <DialogDescription className="pt-0.5 text-slate-500">
            {object?.description}
          </DialogDescription>
          <Label htmlFor="name" className="pt-6 pb-3 text-sm font-semibold">
            Tags
          </Label>
          <div className="flex items-center gap-2">
            {object?.tags.map((tag) => (
              <div
                className="px-3 py-1 text-xs text-white bg-black rounded-xl"
              >
                {tag.name}
              </div>
            ))}
            <button
              className="px-3 py-1 text-xs text-black border 
              border-slate-300 rounded-xl"
            >
              Ajouter +
            </button>
          </div>
        </DialogHeader>
        <Label htmlFor="name" className="pt-8 pb-3 text-sm font-semibold">
          Configuration
        </Label>
        <div className="flex flex-col gap-4">
          {object?.thresholds.map((fields) => (
            <>
              <div className="flex items-center gap-3">
                <Label className='text-sm font-semibold'>Minimum</Label>
                <Input placeholder={fields.minimum}></Input>
              </div>
              <div className="flex items-center gap-3">
                <Label className='text-sm font-semibold'>Maximum</Label>
                <Input placeholder={fields.maximum}></Input>
              </div>
            </>
          ))}
        </div>
        <DialogFooter className='pt-8'>
          <Button
            className="text-red-500 bg-white border border-red-500 
            cursor-pointer hover:text-white hover:bg-red-500"
            type="submit"
          >
            Supprimer
          </Button>
          <Button
            className="text-white bg-black cursor-pointer hover:text-black 
            hover:bg-white hover:border hover:border-black"
            type="submit"
          >
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
