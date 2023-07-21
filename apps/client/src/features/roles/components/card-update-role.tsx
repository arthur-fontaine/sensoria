import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useState } from 'react'
import * as z from 'zod'

import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Switch } from '@/shared/components/ui/switch'
import { useMutation } from '@/shared/hooks/use-query'
import { toast } from '@/shared/hooks/use-toast'

async function onDelete(){
  console.log('test delete')
}

export function CardUpdateRole(properties: object) {

  const data = properties.data
  const roleId = data.roleId
  
  const [permissions, setPermissions] = useState(data.permissions) 

  const handleSwitchChange = (permissionKey: string) => {
    if (permissions.includes(permissionKey)) {
      setPermissions(permissions.filter((perm) => perm !== permissionKey))
    } else {
      setPermissions([...permissions, permissionKey])
    }
  }
  const [modifyPermissionsRoles] = useMutation<void, {
    roleId: number
    permissions: []
  }>((
    mutation,
    { roleId, permissions },
  ) => {
    return mutation.modifyPermissionsRoles({
      roleId, permissions,
    })
  })

  const onSave = async () => {
    try {
      const response = await modifyPermissionsRoles({
        args: {roleId: roleId, permissions: permissions},
      })
      if (response !== undefined) {
        toast({
          title: 'Changement sauvegarder',
        })
      }
    } catch (error) {
      if (error) {
        console.error(error)
      }
    }
  }

  return (
    <Card className='p-6'>
      <CardContent>
        <div>
          <Label>Nom du rôle</Label>
          <Input value={data.name}/>
        </div>
        <div className='space-y-4 mt-8'>
          <Label>Permissions</Label>
          <div className='flex gap-2'>
            <Switch id="view_rooms" className='m-0'
              checked={permissions.includes('view_rooms')} 
              onCheckedChange={() => 
                handleSwitchChange('view_rooms')}
            />
            <span>Voir les salles</span>
          </div>
          <div className='flex gap-2'>
            <Switch id="manage_rooms" className='m-0'
              checked={permissions.includes('manage_rooms')} 
              onCheckedChange={() => handleSwitchChange('manage_rooms')}

            />
            <span>Gérer les salles</span>

          </div>
          <div className='flex gap-2'>
            <Switch id="add_rooms" className='m-0'
              checked={permissions.includes('add_rooms')} 
              onCheckedChange={() => handleSwitchChange('add_rooms')}

            />
            <span>Rajouter des salles</span>

          </div>
          <div className='flex gap-2'>
            <Switch id="view_sensors" className='m-0'
              checked={permissions.includes('view_sensors')} 
              onCheckedChange={() => handleSwitchChange('view_sensors')}

            />
            <span>Voir les capteurs</span>

          </div>
          <div className='flex gap-2'>
            <Switch id="manage_sensors" className='m-0'
              checked={permissions.includes('manage_sensors')} 
              onCheckedChange={() => 
                handleSwitchChange('manage_sensors')}
            />
            <span>Gérer les capteurs</span>

          </div>
          <div className='flex gap-2'>
            <Switch id="add_sensors" className='m-0'
              checked={permissions.includes('add_sensors')} 
              onCheckedChange={() => handleSwitchChange('add_sensors')}
            />
            <span>Rajouter des capteurs</span>

          </div>
        </div>
      </CardContent>      
      <CardFooter className='justify-end gap-2 mt-6'>
        <Button onClick={() => onSave()}>
            Sauvegarder
        </Button>
        <Button variant="outline" className='text-red-600 border-red-600' 
          onClick={() => onDelete()}>
            Supprimer
        </Button>
      </CardFooter>
    </Card>

  )
}
