import { Search, Calendar } from 'lucide-react'

import {ComboboxDropdownMenu} from '../components/dropdown'

import { Button } from '@/shared/components/ui/button'
import { Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent} from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { 
  Select, 
  SelectTrigger,
  SelectValue,
  SelectGroup, 
  SelectContent,
  SelectItem,
  SelectLabel } from '@/shared/components/ui/select'

export function Users() {

  const Users = [
    { userid: 'aled', name: 'Martin', 
      email: 'aled@gmail.com', date: '12/06/30' },
    { userid: 'aled', name: 'Cyp', 
      email: 'aled@gmail.com', date: '12/06/30' },
    { userid: 'aled', name: 'Jules', 
      email: 'aled@gmail.com', date: '12/06/30' },
    { userid: 'aled', name: 'Mehdi', 
      email: 'aled@gmail.com', date: '12/06/30' },
    { userid: 'aled', name: 'Arthur', 
      email: 'aled@gmail.com', date: '12/06/30' },
  ]
  return (
    <div className='px-16 pt-20'>
      <div className='flex flex-col gap-4 mb-14'>
        <h1 className="font-extrabold text-5xl
          balance-text whitespace-pre-line">
          Gestion des Utilisateurs
        </h1>
        <h4 className="font-normal text-xl">
          Visualisez l’ensemble des utilisateurs et leurs rôles.        
        </h4>
      </div>
      <div className='flex justify-between mb-14'>
        <div className='flex gap-4'>
          <div className='relative'>
            <div className='absolute inset-y-0 
                right-0 flex items-center pl-2'>
              <Button asChild variant="outline" size="icon"
                className='rounded-l-none'
              >
                <div>
                  <Search color='#64748B' size={14} />
                </div>
              </Button>
            </div>
            <Input 
              className=' w-[400px]'
              placeholder="Recherche"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtre" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex gap-4'>
          <Button variant="secondary">Roles</Button>
          <Button>Inviter un collaborateur</Button>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        {Users.map((user, index) => (
          <Card key={index}>
            <CardHeader className='pb-0'>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent className='flex justify-between'>
              <div className='flex items-center gap-2'>
                <Calendar color='#64748B' size={16} />
                <CardDescription>{user.date}</CardDescription>
              </div>
              <div className='mb-6'>
                <ComboboxDropdownMenu user={user}>

                </ComboboxDropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
