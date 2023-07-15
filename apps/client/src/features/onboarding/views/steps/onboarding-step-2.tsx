/* eslint-disable max-len */
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { useOnboardingStore } from '../../hooks/stores/use-onboarding-store'

import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Router } from '@/shared/router'

const FormSchema = z.object({
  location: z.string().min(1, {
    message: 'Need name',
  }),
})

export function OnboardingStep2() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location: '',
    },
  })

  const setStep = useOnboardingStore((state) => state.setStep)

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setStep(1, data)
    Router.replace('Onboarding', { step: '3' })
  }

  return (
    <div className='space-y-12'>
      <div>
        <h2 className="font-semibold text-3xl mb-3">Localiser votre batiment</h2>
        <h4 className="font-normal text-xl">
          Entrez l'adresse de votre batiment.<br />
          Nous nous en servirons pour récolter des informations personnalisées.
        </h4>
      </div>
      <div className='w-80'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="Adresse du bâtiment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className="mt-4">Valider</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
