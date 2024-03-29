import { Label } from '@radix-ui/react-label'
import chroma from 'chroma-js'
import {
  BatteryFullIcon, BatteryIcon,
  BatteryLowIcon, BatteryMediumIcon,
} from 'lucide-react'
import {
  PropsWithChildren, useCallback, useEffect,
  useMemo, useState,
} from 'react'

import { Button } from '../../../shared/components/ui/button'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from '../../../shared/components/ui/dialog'
import { Input } from '../../../shared/components/ui/input'
import { useMutation, useQuery } from '../../../shared/hooks/use-query'

interface ModalProperties {
  id: number;
}

export function ObjectModal(properties: PropsWithChildren<ModalProperties>) {
  const [object] = useQuery({
    prepare({ query }) {
      return query.objects({ id: properties.id }).map((object) => ({
        ...object,
        lastMeasure: {
          ...object.lastMeasure,
        },
        tags: object.tags.map((tag) => ({
          ...tag,
        })),
      }))
    },
  }).objects({ id: properties.id })
  const objectId = object?.objectId

  const [deleteObject] = useMutation<undefined, number>((mutation, input) => {
    mutation.deleteObject({ id: input })
  })

  const [editObject] = useMutation<undefined, {
    id: number,
    thresholds: {
      thresholdId: number,
      minimum?: number | undefined,
      maximum?: number | undefined,
    }[],
  }>((mutation, input) => {
    mutation.editObject({
      object: {
        objectId: input.id,
        thresholds: input.thresholds,
      },
    })
  })

  const [modifyInput, setModifyInput] = useState<Record<number, {
    minimum?: number | undefined,
    maximum?: number | undefined,
  }>>({})

  const handleChange =
    useCallback((
      thresholdId: number,
      type: 'minimum' | 'maximum',
      value: string,
    ) => {
      setModifyInput((state) => ({
        ...state,
        [thresholdId]: {
          ...state[thresholdId],
          [type]: value,
        },
      }))
    }, [])

  const handleSave = useCallback(() => {
    if (objectId === undefined) {
      return
    }

    editObject({
      args: {
        id: objectId,
        thresholds: Object.entries(modifyInput).map(([thresholdId, value]) => ({
          thresholdId: Number.parseInt(thresholdId),
          minimum: value.minimum,
          maximum: value.maximum,
        })),
      },
    })
  }, [editObject, modifyInput, objectId])

  const cursorProgress = useMemo(() => {
    const { minimum, maximum } = Object.values(modifyInput)[0] ?? {}
    const currentValue = object?.lastMeasure?.value

    if (
      minimum === undefined ||
      maximum === undefined ||
      currentValue === undefined
    ) {
      return
    }

    if (minimum > currentValue) {
      return 0
    }

    if (maximum < currentValue) {
      return 100
    }

    return (currentValue - minimum) * 100 / (maximum - minimum)
  }, [modifyInput, object])

  const colorTriangle = useMemo(() =>
    chroma.scale(['green', 'orange', 'red']), [])

  const changeColor = useMemo(
    () => cursorProgress === undefined
      ? 0
      : colorTriangle((cursorProgress / 100)).toString(),
    [colorTriangle, cursorProgress],
  )

  useEffect(() => {
    if (Object.values(modifyInput).length === 0 && object !== undefined) {
      setModifyInput(
        Object.fromEntries(object.thresholds.flatMap((threshold) => {
          return threshold.thresholdId === undefined
            ? []
            : [[threshold.thresholdId, {
              minimum: threshold.minimum ?? undefined,
              maximum: threshold.maximum ?? undefined,
            }]]
        })),
      )
    }
  }, [])

  // }, [object])

  return (
    <Dialog>
      <DialogTrigger asChild>
        {properties.children}
      </DialogTrigger>
      <DialogContent className="gap-0 sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-end gap-3">
            <DialogTitle className="text-xl">{object?.name}</DialogTitle>
            {
              (object?.batteryLevel !== undefined
                && object?.batteryLevel !== null)
              &&
              <div className="flex items-center gap-1 text-sm text-slate-500">
                {
                  object.batteryLevel === 0
                    ? <BatteryIcon />
                    : (object.batteryLevel < 0.25
                      ? <BatteryLowIcon />
                      // eslint-disable-next-line unicorn/no-nested-ternary
                      : object.batteryLevel < 0.5
                        ? <BatteryMediumIcon />
                        : <BatteryFullIcon />)
                }
                {object.batteryLevel * 100}%
              </div>
            }
          </div>
          {object?.description !== undefined && object?.description !== null &&
            object?.description !== '' &&
            <DialogDescription className="pt-0.5 text-slate-500">
              {object?.description}
            </DialogDescription>
          }
          {(
            object?.lastMeasure?.value !== undefined &&
            cursorProgress
          ) && <>
            <Label htmlFor="name"
              className="pt-6 pb-3 text-sm font-semibold">
                Mesure en temps réel
            </Label>
            <div className='flex flex-col items-center gap-[2px]'>
              <div className="h-2 w-full rounded-full 
                    bg-gradient-to-r from-green-500
                  via-orange-500 to-red-500 ...">
              </div>
              <div className='relative w-full'>
                <div>
                  <svg width="16" height="10"
                    viewBox="0 0 16 10"
                    className='relative -translate-x-1/2' style={{
                      left: `${cursorProgress}%`,
                    }} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14.2929 7.29289L8.70711 1.70711C8.31658
                     1.31658 7.68342 1.31658 7.29289 1.70711L1.70711 
                      7.29289C1.07714 7.92286 1.52331 9 2.41421
                      9H13.5858C14.4767 9 14.9229 7.92286
                      14.2929 7.29289Z" fill={`${changeColor}88`}
                      stroke={
                        typeof changeColor === 'number'
                          ? undefined
                          : changeColor
                      } />
                  </svg>
                </div>
              </div>
            </div>
          </>}
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
              className="px-3 py-1 text-xs text-black border border-slate-300
                rounded-xl">
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
                <Label className='text-sm font-medium leading-[14px]'>
                  Minimum
                </Label>
                <Input
                  placeholder="Minimum"
                  type='number'
                  onChange={(event) =>
                    handleChange(
                      fields.thresholdId,
                      'minimum',
                      event.target.value,
                    )
                  }
                  {
                    ...fields.minimum === undefined || fields.minimum === null
                      ? {}
                      : { defaultValue: fields.minimum.toString() }
                  }
                />
              </div>
              <div className="flex items-center gap-3">
                <Label className='text-sm font-medium leading-[14px]'>
                  Maximum
                </Label>
                <Input
                  placeholder="Maximum"
                  type='number'
                  onChange={(event) =>
                    handleChange(
                      fields.thresholdId,
                      'maximum',
                      event.target.value,
                    )
                  }
                  {
                    ...fields.maximum === undefined || fields.maximum === null
                      ? {}
                      : { defaultValue: fields.maximum.toString() }
                  }
                />
              </div>
            </>
          ))}

        </div>
        <DialogFooter className='pt-8'>
          <Button
            onClick={() => objectId && deleteObject({
              args: objectId,
            })}
            className="text-red-500 bg-white border border-red-500
            cursor-pointer hover:text-white hover:bg-red-500"
            type="submit"
          >
            Supprimer
          </Button>
          <Button
            className="text-white bg-black cursor-pointer hover:text-blac
            hover:bg-white hover:border hover:border-black"
            type="submit"
            onClick={handleSave}
          >
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
