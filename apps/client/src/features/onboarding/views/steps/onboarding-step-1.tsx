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
  blockName: z.string().min(1, {
    message: 'Need name',
  }),
})

export function OnboardingStep1() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      blockName: '',
    },
  })

  const setStep = useOnboardingStore((state) => state.setStep)

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setStep(0, data)
    Router.replace('Onboarding', { step: '2' })
  }

  return (
    <div className='space-y-12'>
      <div>
        <h2 className="font-semibold text-3xl mb-3">Pour commencer...</h2>
        <h4 className="font-normal text-xl">
          Quel est le nom du bâtiment que vous souhaitez protéger ?
        </h4>
      </div>
      <div className='w-80'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="blockName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nom du bâtiment"
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Valider</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
