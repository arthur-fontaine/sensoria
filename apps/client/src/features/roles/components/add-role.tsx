import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
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

export function DialogAddRole() {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter un nouveau rôle</Button>
      </DialogTrigger>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau rôle</DialogTitle>
        </DialogHeader>
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
                    <Input {...field} className='w-full' />
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
                        onCheckedChange={field.onChange}/>
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
                        onCheckedChange={field.onChange}/>
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
                        onCheckedChange={field.onChange}/>
                    </FormControl>
                    <FormLabel>Rajouter des capteurs</FormLabel>
                  </FormItem>
                )} />
            </div>
            <div className='flex mt-8 justify-end gap-2'>
              <Button variant="outline" className='text-green-600 
            border-green-600' type='submit'>
            Ajouter
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
