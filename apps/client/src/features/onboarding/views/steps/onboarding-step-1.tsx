import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '../../../../shared/components/ui/button'
import { Input } from '../../../../shared/components/ui/input'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/components/ui/form'

const FormSchema = z.object({
  name: z.string().min(1, {
    message: 'Need name',
  }),
})

export function OnboardingStep1() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log({
      title: 'You submitted the following values:',
      description: (data),
    })
  }

  return (
    <>
      <div className="my-12">
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
              name="name"
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
    </>
  )
}
