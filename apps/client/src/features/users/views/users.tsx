import { Search, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'

import {DialogAddUser} from '../components/addusers'
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

  const roles = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'moderator', label: 'Modérateur' },
    { value: 'user', label: 'Utilisateur' },
    { value: 'piegon', label: 'Oiseau' },
    { value: 'aled', label: 'Alllleeed' },
  ]

  const Users = [
    { userid: 'aled', name: 'Martin', 
      email: 'aled@gmail.com', date: '12/06/30', 
      role: {value: 'aled', label: 'Alllleeed'} },
    { userid: 'aled', name: 'Cyp', 
      email: 'aled@gmail.com', date: '12/06/30',
      role: {value: 'aled', label: 'Alllleeed'} },
    { userid: 'aled', name: 'Jules', 
      email: 'aled@gmail.com', date: '12/06/30',
      role: {value: 'aled', label: 'Alllleeed'} },
    { userid: 'aled', name: 'Mehdi', 
      email: 'aled@gmail.com', date: '12/06/30',
      role: {value: 'user', label: 'Utilisateur'} },
    { userid: 'aled', name: 'Arthur', 
      email: 'aled@gmail.com', date: '12/06/30',
      role: {value: 'moderator', label: 'Modérateur'} },
  ]

  const [selectedRole, setSelectedRole] = useState<string | null>()
  const [filteredUsers, setFilteredUsers] = useState(Users)
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    if(searchQuery){
      const filtered = Users.filter((user) =>
        user.name.toLowerCase().startsWith(searchQuery.toLowerCase()))
      setFilteredUsers(filtered)
    } else if (selectedRole) {
      const filtered = Users.filter((user) => user.role.value === selectedRole)
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(Users)
    }
  }, [selectedRole, searchQuery])
  
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
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <Select onValueChange={(value) => setSelectedRole(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder="Filtre" 
                
              >
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex gap-4'>
          <Button variant="secondary">Roles</Button>
          <DialogAddUser></DialogAddUser>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        {filteredUsers.map((user, index) => (
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
                <ComboboxDropdownMenu user={user}></ComboboxDropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
