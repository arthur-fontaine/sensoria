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
import { useQuery } from '@/shared/hooks/use-query'

export function Users() {
  const { roles, users, $state } = useQuery({})

  const [selectedRole, setSelectedRole] = useState<string | null>()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredUsers, setFilteredUsers] = useState(users)

  useEffect(() => {
    let newUsers = users

    if (searchQuery) {
      newUsers = newUsers.filter((user) =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedRole) {
      newUsers = newUsers.filter((user) => user.role.name === selectedRole)
    }

    if (newUsers.length !== filteredUsers.length) {
      setFilteredUsers(newUsers)
    }
  }, [selectedRole, searchQuery, users])
  
  return (
    <div className='px-16 pt-20'>
      <div className='flex flex-col gap-4 mb-14'>
        <h1 className="font-extrabold text-5xl
          balance-text whitespace-pre-line">
          Gestion des utilisateurs
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
            <SelectContent className='max-h-60'>
              <SelectGroup className=''>
                <SelectLabel>Roles</SelectLabel>
                {roles.map((role, index) => (
                  <SelectItem key={index} value={role.name} 
                  >
                    <span className='line-clamp-1	'>{role.name}</span>
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
        {!$state.isLoading && filteredUsers.map((user, index) => (
          <Card key={index}>
            <CardHeader className='pb-0'>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent className='flex justify-between'>
              <div className='flex items-center gap-2'>
                <Calendar color='#64748B' size={16} />
                <CardDescription>
                  {new Date(Number(user.joinedAt)).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className='mb-6'>
                <ComboboxDropdownMenu roles={roles} user={user}>
                </ComboboxDropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
