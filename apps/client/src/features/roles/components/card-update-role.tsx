import { zodResolver } from '@hookform/resolvers/zod'
import { roles } from '@sensoria/api/src/db/schema'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/shared/components/ui/button'
import {
  Card,
} from '@/shared/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Switch } from '@/shared/components/ui/switch'

const FormSchema = z.object({
  name: z.string().min(1, {
    message: 'Entrez un nom',  
  }),
  seerooms: z.boolean().default(false),
  managerooms: z.boolean().default(false),
  addrooms: z.boolean().default(false),
  seesensors: z.boolean().default(false),
  managesensors: z.boolean().default(false),
  addsensors: z.boolean().default(false),
})

async function onSubmit(){
  console.log('test sumbit')
}

async function onDelete(){
  console.log('test delete')
}

async function onSave(){
  console.log('test save')
}

export function CardUpdateRole(properties: object) {

  const data = properties.data

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data.label,
      seerooms: data.permission.seerooms,
      managerooms: data.permission.managerooms,
      addrooms: data.permission.addrooms,
      seesensors: data.permission.seesensors,
      managesensors: data.permission.managesensors,
      addsensors: data.permission.addsensor,
    },
  })

  return (
    <Card className='p-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du rôle</FormLabel>
                <FormControl>
                  <Input 
                    {...field} className='w-full' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='space-y-3 mt-8'>
            <FormLabel className='mt-6'>Permissions</FormLabel>
            <FormField
              control={form.control}
              name="seerooms"
              render={({ field }) => (
                <FormItem className='space-y-0 flex gap-2 items-center' >
                  <FormControl >
                    <Switch id="seerooms" className='m-0'
                      checked={field.value} onCheckedChange={field.onChange}/>
                  </FormControl>
                  <FormLabel>Voir les salles</FormLabel>
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="managerooms"
              render={({ field }) => (
                <FormItem className='space-y-0 flex gap-2 items-center' >
                  <FormControl >
                    <Switch id="managerooms" className='m-0'
                      checked={field.value} onCheckedChange={field.onChange}/>
                  </FormControl>
                  <FormLabel>Gérer les salles</FormLabel>
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="addrooms"
              render={({ field }) => (
                <FormItem className='space-y-0 flex gap-2 items-center' >
                  <FormControl >
                    <Switch id="addrooms" className='m-0'
                      checked={field.value} 
                      onCheckedChange={field.onChange}/>                 
                  </FormControl>
                  <FormLabel>Rajouter des salles</FormLabel>
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="seesensors"
              render={({ field }) => (
                <FormItem className='space-y-0 flex gap-2 items-center' >
                  <FormControl >
                    <Switch id="seesensors" className='m-0'
                      checked={field.value} 
                      onCheckedChange={field.onChange}/>                     
                  </FormControl>
                  <FormLabel>Voir les capteurs</FormLabel>
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="managesensors"
              render={({ field }) => (
                <FormItem className='space-y-0 flex gap-2 items-center' >
                  <FormControl >
                    <Switch id="managesensors" className='m-0'
                      checked={field.value} 
                      onCheckedChange={field.onChange}/>                   
                  </FormControl>
                  <FormLabel>Gérer les capteurs</FormLabel>
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="addsensors"
              render={({ field }) => (
                <FormItem className='space-y-0 flex gap-2 items-center' >
                  <FormControl >
                    <Switch id="addsensors" className='m-0'
                      checked={field.value} 
                      onCheckedChange={field.onChange}/>                       
                  </FormControl>
                  <FormLabel>Rajouter des capteurs</FormLabel>
                </FormItem>
              )} />
          </div>
          <div className='flex mt-8 justify-end gap-2'>
            <Button onClick={() => onSave()}>
            Sauvegarder
            </Button>
            <Button variant="outline" className='text-red-600 border-red-600' 
              onClick={() => onDelete()}>
            Supprimer
            </Button>
          </div>
        </form>
      </Form>
    </Card>

  )
}
