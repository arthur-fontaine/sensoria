import { DialogAddRole } from '../components/add-role'
import { CardUpdateRole } from '../components/card-update-role'

import { useQuery } from '@/shared/hooks/use-query'

export  function Roles() {
  const { roles, $state } = useQuery({})

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
        {!$state.isLoading && roles.map((role, index) => (
          role && <CardUpdateRole data={role} key={index} />
        ))}
      </div>
    </div>
  )
}
