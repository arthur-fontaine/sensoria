import React, { useState } from 'react'
 
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useMutation } from '@/shared/hooks/use-query'
import { toast } from '@/shared/hooks/use-toast'

export function DialogAddUser() {

  const [name, setName] = useState('') 
  const [email, setEmail] = useState('') 
  const [open, setOpen] = React.useState(false)

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }
  const [addUser] = useMutation<void, {
    name: string,
    email: string,
  }>((
    mutation,
    { name, email },
  ) => {
    return mutation.addUser({
      name, email,
    })
  })
  const submitAddUser = (async () => {
    try {
      const response = await addUser({
        args: {name, email},
      })
      if (response !== undefined) {
        toast({
          title: 'Utilisateur ajouter',
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Inviter un collaborateur</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inviter un collaborateur</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Nom
            </Label>
            <Input id="username" value={name}
              className="col-span-3"
              onChange={handleNameChange}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Email
            </Label>
            <Input id="name" value={email}
              className="col-span-3" onChange={handleEmailChange} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={submitAddUser}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
