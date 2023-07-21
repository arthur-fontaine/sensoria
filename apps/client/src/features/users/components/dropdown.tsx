'use client'

import { Mails, MoreHorizontal, Tags, Trash, Check } from 'lucide-react'
import * as React from 'react'
import { useCallback, useState } from 'react'

import { Button } from '@/shared/components/ui/button'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { useMutation } from '@/shared/hooks/use-query'
import { toast } from '@/shared/hooks/use-toast'

export function ComboboxDropdownMenu(data) {
  const user = data.user

  const roles = data.roles

  const [roleActive, setRolesActive] = useState(data.user.role.name) 

  const [deleteUser] = useMutation<void, {
    userId: number
  }>((
    mutation,
    { userId },
  ) => {
    return mutation.deleteUser({
      userId,
    })
  })

  const [modifyRole] = useMutation<void, {
    userId: number
    newRole: string
  }>((
    mutation,
    { userId, newRole },
  ) => {
    return mutation.modifyRole({
      userId, newRole,
    })
  })

  const [open, setOpen] = React.useState(false)
 
  const submitDeleteUser = useCallback(async () => {
    try {
      const response = await deleteUser({
        args: {userId: user.userId},
      })
      if (response !== undefined){
        toast({
          title: 'Utilisateur supprimer',
        })
      }
    } catch (error) {
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur de suppression',
          description: 'Veuillez réessayer plus tard',
        })
      }
    }
  }, [user.userId])
  
  const sumbitModifyRole = useCallback(async (newRoleName: string) => {
    try {
      await modifyRole({
        args: {userId: user.userId, newRole: newRoleName},
      })
      setOpen(false)
    } catch (error) {
      console.error(error)
    }
  }, [user.userId])
  
  const handleRoleChange = (newRole:string) => {
    sumbitModifyRole(newRole.name)
    setRolesActive(newRole.name)
    setOpen(false) 
   
  }
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <Mails className="mr-2 h-4 w-4" />
            {user.email}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Tags className="mr-2 h-4 w-4" />
              Appliquer un role
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-0">
              <Command className='max-h-60'>
                <CommandInput placeholder="Filtre roles..." autoFocus={true} />
                <CommandList className="max-h-60">
                  {roles.map((role, index) => (
                    <CommandItem
                      className="justify-between"
                      key={index}
                      onSelect={() => handleRoleChange(role)} 
                    >
                      <span className='w-[20ch] text-ellipsis truncate'>
                        {role.name}
                      </span>
                      {role.name === roleActive&& <Check size={12} />}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600" 
            onSelect={submitDeleteUser}>
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

