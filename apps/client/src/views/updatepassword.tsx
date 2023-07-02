import { zodResolver } from '@hookform/resolvers/zod'
import { EyeOff } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '../components/ui/button'
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

const FormSchema = z.object({
  oldpassword: z.string().min(1, {
    message: 'Entrez votre mot de passe actuel',
  }),   

  newpassword: z.string()
    .refine(value => {
      const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z])[\dA-Za-z]{12,}$/
      return regexPassword.test(value)
    }, {
      message: 
      'Le mot de passe doit contenir au moins 12 caractères, ' 
      + 'dont une lettre minuscule et majuscule et un chiffre',
    }),
  confirmPassword: z.string()
    .min(
      1, 
      { message: 'La confirmation de mot de passe est nécessaire' },
    ),
}).refine((data)=> data.newpassword === data.confirmPassword, {
  path: ['confirmPassword'],
  message:'Les deux nouveaux mots de passes ne sont pas identiques.',
})

export function Updatepassword() {
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oldpassword: '',
      newpassword: '',
      confirmPassword: '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log({
      title: 'You submitted the following values:',
      description: ( data ),
    })
  }

  const togglePasswordVisibility = useCallback((type: string) => {
    switch (type) {
      case 'old': {
        setShowOldPassword((previousValue) => !previousValue)
        break
      }
      case 'new': {
        setShowNewPassword((previousValue) => !previousValue)
        break
      }
      case 'confirm': {
        setShowConfirmPassword((previousValue) => !previousValue)
        break
      }
      default: {
        break
      }
    }
  }, [])

  return (
    <div className="flex items-center justify-center 
    place-content-center h-full">
      <Card className='p-10'>
        <CardHeader className='px-0'>
          <CardTitle >
            Pour modifier son mot de passe
          </CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-6">
          
            <FormField
              control={form.control}
              name="oldpassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passse actuel</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <div className='absolute inset-y-0 
                right-0 flex items-center pl-2'>
                        <Button asChild variant="ghost" size="icon"
                          onClick={() => togglePasswordVisibility('old')}  >
                          <div>
                            <EyeOff  color='#CBD5E1' size={24} />
                          </div>
                        </Button>
                      </div>
                      <Input type={showOldPassword ? 'text' : 'password'}
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
              name="newpassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <div className='absolute inset-y-0 
                right-0 flex items-center pl-2'>
                        <Button asChild variant="ghost" size="icon"
                          onClick={() => togglePasswordVisibility('new')} >
                          <div>
                            <EyeOff  color='#CBD5E1' size={24} />
                          </div>
                        </Button>
                      </div>
                      <Input type={showNewPassword ? 'text' : 'password'}
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <div className='absolute inset-y-0 
                right-0 flex items-center pl-2'>
                        <Button asChild variant="ghost" size="icon" 
                          onClick={() => 
                            togglePasswordVisibility('confirm')}
                        >                     
                          <div>
                            <EyeOff  color='#CBD5E1' size={24} />
                          </div>
                        </Button>
                      </div>
                      <Input type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Mot de passe" 
                        {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> 
            <Button type="submit">Se connecter</Button>
          </form>
        </Form>
      </Card> 
    </div>
  )
}
