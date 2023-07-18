'use client'

import { Mails, MoreHorizontal, Tags, Trash, Check } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/shared/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
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

export function ComboboxDropdownMenu(userid: string) {
  const [label, setLabel] = React.useState('feature')
  const [open, setOpen] = React.useState(false)
  const [labels, setLabels] = React.useState([
    { name: 'feature', select: true },
    { name: 'bug', select: false },
    { name: 'design', select: true },
    { name: 'maintenance', select: false },
    { name: 'scientifique', select: false },
  ])

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
              email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Tags className="mr-2 h-4 w-4" />
                Apply tag
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-0">
              <Command>
                <CommandInput
                  placeholder="Filter tag..."
                  autoFocus={true}
                />
                <CommandList>
                  <CommandEmpty>No tag found.</CommandEmpty>
                  <CommandGroup>
                    {labels.map((label, index) => (
                      <CommandItem
                        className='justify-between'
                        key={index}
                        onSelect={() => {
                          const updatedLabels = labels.map((item) => {
                            if (item.name === label.name) {
                              return { ...item, select: !item.select }
                            }
                            return item
                          })
                          setLabel(label.select ? 'feature' : label.name) 
                          setLabels(updatedLabels) 

                        //   setOpen(false)
                        }}
                      >
                        {label.name}
                        {label.select && <Check size={12} />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
              Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
