import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
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
import { useMutation } from '@/shared/hooks/use-query'
import { toast } from '@/shared/hooks/use-toast'

const FormSchema = z.object({
  name: z.string().min(1, {
    message: 'Entrez un nom',  
  }),
  view_rooms: z.boolean().default(false),
  manage_rooms: z.boolean().default(false),
  add_rooms: z.boolean().default(false),
  view_sensors: z.boolean().default(false),
  manage_sensors: z.boolean().default(false),
  add_sensors: z.boolean().default(false),
})

export function DialogAddRole() {

  const [open, setOpen] = React.useState(false)

  const [addRole] = useMutation<void, {
    name: string,
    permissions: [],
  }>((
    mutation,
    { name, permissions },
  ) => {
    return mutation.addRole({
      name, permissions,
    })
  })
  
  const onSubmit = (async (data: z.infer<typeof FormSchema>) => {

    const permissions = Object.entries(data)
      .filter(([key, value]) => typeof value === 'boolean' && value === true)
      .map(([key]) => key)
    
    try {
      const response = await addRole({
        args: {name : data.name, permissions: permissions},
      })
      if (response !== undefined) {
        toast({
          title: 'Role ajouter',
        })
      }

      setOpen(false)
    } catch (error) {
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Veuillez réessayer plus tard',
        })
      }
    }
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                name="view_rooms"
                render={({ field }) => (
                  <FormItem className='space-y-0 flex gap-2 items-center' >
                    <FormControl >
                      <Switch id="view_rooms" className='m-0'
                        onCheckedChange={field.onChange}/>
                    </FormControl>
                    <FormLabel>Voir les salles</FormLabel>
                  </FormItem>
                )} />
              <FormField
                control={form.control}
                name="manage_rooms"
                render={({ field }) => (
                  <FormItem className='space-y-0 flex gap-2 items-center' >
                    <FormControl >
                      <Switch id="manage_rooms" className='m-0'
                        onCheckedChange={field.onChange}/>
                    </FormControl>
                    <FormLabel>Gérer les salles</FormLabel>
                  </FormItem>
                )} />
              <FormField
                control={form.control}
                name="add_rooms"
                render={({ field }) => (
                  <FormItem className='space-y-0 flex gap-2 items-center' >
                    <FormControl >
                      <Switch id="add_rooms" className='m-0'
                        onCheckedChange={field.onChange}/>                 
                    </FormControl>
                    <FormLabel>Rajouter des salles</FormLabel>
                  </FormItem>
                )} />
              <FormField
                control={form.control}
                name="view_sensors"
                render={({ field }) => (
                  <FormItem className='space-y-0 flex gap-2 items-center' >
                    <FormControl >
                      <Switch id="view_sensors" className='m-0'
                        onCheckedChange={field.onChange}/>                     
                    </FormControl>
                    <FormLabel>Voir les capteurs</FormLabel>
                  </FormItem>
                )} />
              <FormField
                control={form.control}
                name="manage_sensors"
                render={({ field }) => (
                  <FormItem className='space-y-0 flex gap-2 items-center' >
                    <FormControl >
                      <Switch id="manage_sensors" className='m-0'
                        onCheckedChange={field.onChange}/>                   
                    </FormControl>
                    <FormLabel>Gérer les capteurs</FormLabel>
                  </FormItem>
                )} />
              <FormField
                control={form.control}
                name="add_sensors"
                render={({ field }) => (
                  <FormItem className='space-y-0 flex gap-2 items-center' >
                    <FormControl >
                      <Switch id="add_sensors" className='m-0'
                        onCheckedChange={field.onChange}/>
                    </FormControl>
                    <FormLabel>Rajouter des capteurs</FormLabel>
                  </FormItem>
                )} />
            </div>
            <div className='flex mt-8 justify-end gap-2'>
              <Button type='submit'>
            Ajouter
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
