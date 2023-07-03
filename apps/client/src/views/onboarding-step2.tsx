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
} from '@/components/ui/form'

const FormSchema = z.object({

  name: z.string().min(1, {
    message: 'Need name',
  }),
})

export function OnboardingStep2() {

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
          Configuration de Sensoria
        </h1>
        <h6 className="ml-auto">2 sur 3</h6>
      </div>
      <div className="my-8">
        <h2 className="font-semibold text-3xl mb-3">Localiser votre batiment</h2>
        <h4 className="font-normal text-xl mb-12">
          Entrez l'adresse de votre batiment.<br/>
          Nous nou en servirons pour récolter des informations personnalisées.
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
                    <Input type="text"placeholder="Adresse du batiment" {...field} />
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
