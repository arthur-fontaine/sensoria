/* eslint-disable max-len */
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

const FormSchema = z.object({

  name: z.string().min(1, {
    message: 'Need name',
  }),
})

export function Onboarding() {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log({
      title: 'You submitted the following values:',
      description: ( data ),
    })
  }
  return (
    <div className="container mt-20 mx-10 flex-initial">
      <div className="flex justify-between ">
        <h1 className="font-extrabold text-5xl mb-40">
          Bienvenue sur l'outil d'assistance à la<br />configuration de Sensoria
        </h1>
        <h6 className="ml-auto">1 sur 3</h6>
      </div>
      <div className="my-8">
        <h2 className="font-semibold text-3xl">Pour commencer...</h2>
        <h4 className="font-normal text-xl mb-10">
          Quel est le nom du bâtiment que vous souhaitez protéger ?
        </h4>
      </div>
      <div className='w-80'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text"placeholder="Nom du bâtiment" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile.
                  </FormDescription>
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
