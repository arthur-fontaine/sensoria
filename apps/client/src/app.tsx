import { Label } from '@radix-ui/react-label'

import { Dashboard } from '@/features/dashboard/views/dashboard'
import { Login } from '@/features/login/views/login'
import { Updatepassword } from '@/features/login/views/updatepassword'
import { Onboarding } from '@/features/onboarding/views/onboarding'
import { Roles } from '@/features/roles/views/roles'
import { Tag } from '@/features/tag/views/tag'
import { Users } from '@/features/users/views/users'
import { useRoute } from '@/shared/hooks/use-route'

export function App() {

  const route = useRoute([
    'Login',
    'Updatepassword',
    'Onboarding',
    'Dashboard',
    'Users',
    'Tag',
    'Roles',
  ])

  const token = sessionStorage.getItem('token') ?? localStorage.getItem('token')
  
  if (!token && !([
    'Onboarding',
    'Login',
  ]).includes(route?.name ?? '')) {
    return <Login />
  }

  switch (route?.name) {
    case 'Login': {
      return <Login />
    }
    case 'Updatepassword': {
      return <Updatepassword />
    }
    case 'Onboarding': {
      return <Onboarding />
    }
    case 'Dashboard': {
      return <Dashboard />
    }
    case 'Users': {
      return <Users />
    }
    case 'Tag': {
      return <Tag />
    }
    case 'Roles': {
      return <Roles />
    }

    default: {
      return <Label>Not found</Label>
    }
  }
}
