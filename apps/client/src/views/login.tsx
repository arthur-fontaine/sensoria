import { zodResolver } from '@hookform/resolvers/zod'
import { EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '../components/ui/button'
import { Checkbox } from '../components/ui/checkbox'
import { Input } from '../components/ui/input'

import { Card, CardHeader, CardTitle, 
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { resolve } from '@/hooks/use-query'
import { toast } from '@/hooks/use-toast'
import { Router } from '@/router'

const FormSchema = z.object({
  email: z.string()
    .refine(value => {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
      return regexEmail.test(value)
    }, {
      message: "Mauvais format d'email",
    }),

  password: z.string().min(1, {
    message: 'Entrez un mot de passe',
  }),
  memory: z.boolean().default(false).optional(),
})

export function Login() {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const token = await resolve(({ query }) => {
      return query.authentication({
        email: data.email, password: data.password, 
      })
    })
    if (token && data.memory == true){
      localStorage.setItem('token', token)
      Router.push('Dashboard')
    }else if (token && data.memory == undefined){
      sessionStorage.setItem('token', token)
      Router.push('Dashboard')
    }else {
      toast({
        variant: 'destructive',
        title: 'Erreur de connexion',
        description:'Votre email ou mot de passe est incorrect',
      })
    }
  }

  return (
    <div className="flex items-center justify-center 
    place-content-center h-full">
      
      <Card className='p-10 '>
        <CardHeader className='p-0 pb-6'>
          <CardTitle >
            Pour se connecter à votre compte
          </CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-6">
          
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} className='w-full'/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <div className='absolute inset-y-0 
                right-0 flex items-center pl-2'>
                        <Button asChild variant="ghost" size="icon" 
                          onClick={() => setShowPassword(!showPassword)} >
                          <div>
                            <EyeOff  color='#CBD5E1' size={24} />
                          </div>
                        </Button>
                      </div>
                      <Input type={showPassword ? 'text' : 'password'} 
                        placeholder="Mot de passe" 
                        {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memory"
              render={({ field }) => (
                <FormItem>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange} />
                  <FormControl>
                    <FormLabel
                      className="text-sm font-medium leading-none ml-2
                peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                Se souvenir de moi
                    </FormLabel>
                  </FormControl>
                </FormItem>
              )}  />
            <Button type="submit">Se connecter</Button>
          </form>
        </Form>
      </Card> 
    </div>
  )
}
