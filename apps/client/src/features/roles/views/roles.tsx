import { DialogAddRole } from '../components/add-role'
import { CardUpdateRole } from '../components/card-update-role'

export function Roles() {
  const roles = [
    { userid: 'admin', label: 'Administrateur', 
      permission: {
        seerooms: true, 
        managerooms: true, 
        addrooms: false, 
        seesensors: false, 
        managesensors: true, 
        addsensors: true},
    },
    { roleid: 'moderator', label: 'Modérateur',
      permission: {
        seerooms: true, 
        managerooms: true, 
        addrooms: false, 
        seesensors: false, 
        managesensors: true, 
        addsensors: true}, 
    },
    { roleid: 'user', label: 'Utilisateur', 
      permission: {
        seerooms: true, 
        managerooms: false, 
        addrooms: false, 
        seesensors: false, 
        managesensors: true, 
        addsensors: true}, 
    },
    { roleid: 'piegon', label: 'Oiseau', 
      permission: {
        seerooms: true, 
        managerooms: false, 
        addrooms: false, 
        seesensors: false, 
        managesensors: true, 
        addsensors: true}, 
    },
    { roleid: 'aled', label: 'Alllleeed',       
      permission: {
        seerooms: true, 
        managerooms: false, 
        addrooms: false, 
        seesensors: false, 
        managesensors: true, 
        addsensors: true}, 
    },
  ]
  return (
    <div className='px-16 pt-20'>
      <div className='flex gap-4 mb-14 items-center justify-between'>
        <h1 className="font-extrabold text-5xl
          balance-text whitespace-pre-line">
          Rôles        
        </h1>
        <div className='flex gap-4'>
          <DialogAddRole/>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-12'>
        
        {roles.map((role, index) => (
          <CardUpdateRole data={role} key={index} />
        ))}
      </div>
    </div>
  )
}
