'use client'

import { Mails, MoreHorizontal, Tags, Trash, Check } from 'lucide-react'
import * as React from 'react'

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

export function ComboboxDropdownMenu(data) {
  const user = data.user
  const roles = data.roles

  const [roleName, setroleName] = React.useState(user.role.name)
  const [open, setOpen] = React.useState(false)
  
  const handleRoleChange = (newRole:string) => {
    setroleName(newRole.name)
    setOpen(false) 

    const updatedUser = { ...user, role: newRole }
   
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
            {data.user.email}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Tags className="mr-2 h-4 w-4" />
              Appliquer Role
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-0">
              <Command>
                <CommandInput placeholder="Filtre roles..." autoFocus={true} />
                <CommandList className="max-h-60">
                  {roles.map((role, index) => (
                    <CommandItem
                      className="justify-between"
                      key={index}
                      onSelect={() => handleRoleChange(role)} 
                    >
                      {role.name}
                      {role.name === user.role.name && <Check size={12} />}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

