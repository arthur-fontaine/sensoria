import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useOnboardingStore } from '../../hooks/stores/use-onboarding-store'
import { useStagesStore } from '../../hooks/stores/use-stages-store'

import { Button } from '@/shared/components/ui/button'
import {
  Form, FormField, FormItem, FormControl, FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { useMutation } from '@/shared/hooks/use-query'

type CreateBlockArguments = NonNullable<Parameters<Parameters<
  NonNullable<Parameters<typeof useMutation>[0]>
>[0]['createBlock']>[0]>

const FormSchema = z.object({
  email: z.string().email({
    message: 'Email invalide',
  }),
})

export function OnboardingSubmit() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  })
  const stepsValues = useOnboardingStore((state) => state.steps)
  const stages = useStagesStore((state) => state.stages)

  const [submitBlock, { isLoading }] = useMutation<void, CreateBlockArguments>(
    ({ createBlock }, inputs) => {
      const block = createBlock(inputs)

      block.blockId
    },
  )

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      const blockName = stepsValues[0].values.blockName

      if (!blockName) {
        throw new Error('Missing block name')
      }

      const location = stepsValues[1].values.location

      if (!location) {
        throw new Error('Missing location')
      }

      const { latitude, longitude } = (
        await fetch(
          `https://geocode.maps.co/search?q=${encodeURIComponent(location)}`,
        )
          .then((response) => response.json())
          .then((data) => ({
            latitude: Number(data[0].lat),
            longitude: Number(data[0].lon),
          }))
      )

      await submitBlock({
        args: {
          block: {
            name: blockName,
            location: [latitude, longitude],
            halls: await Promise.all(
              stages.map(async (stage) => {
                if (stage.image === undefined) {
                  throw new Error('Missing stage image')
                }

                return {
                  label: stage.name,
                  map: {
                    base64: await blobToBase64(stage.image),
                  },
                  objects: stage.objects.map((object) => {
                    if (object.emplacement === null ||
                      object.emplacement === undefined) {
                      throw new Error('Missing object emplacement')
                    }

                    return {
                      objectId: object.objectId,
                      emplacement: object.emplacement,
                    }
                  }),
                }
              }),
            ),
          },
          email: data.email,
        },
      })

      // TODO: Redirect to the auth page
    },
    [submitBlock, stepsValues, stages],
  )

  return (
    <div className='space-y-12'>
      <div>
        <h2 className='font-semibold text-3xl mb-3'>C'est parti !</h2>
        <h4 className='font-normal text-xl'>
          Renseignez votre email pour recevoir vos identifiants de connexion.
        </h4>
      </div>
      <div className='w-80'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='mt-4'
              disabled={isLoading}
            >
              {isLoading
                ? (<>
                  <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                  Chargement
                </>)
                : 'Valider'
              }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('error', reject)
    reader.addEventListener('load', () => {
      resolve(reader.result as string)
    })

    reader.readAsDataURL(blob)
  })
}
