// import { useQuery } from './hooks/use-query'
import { Label } from '@radix-ui/react-label'

import { Dashboard } from './views/dashboard'
import { Login } from './views/login'
import { Onboarding } from './views/onboarding'
import { Tag } from './views/tag'
import { Updatepassword } from './views/updatepassword'
import { Users } from './views/users'

import { useRoute } from '@/hooks/use-route'

export function App() {

  const route = useRoute([
    'Login',
    'Updatepassword',
    'Onboarding',
    'Dashboard',
    'Users',
    'Tag',
  ])

  const token = sessionStorage.getItem('token') ?? localStorage.getItem('token')
  
  if (!token) {
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

    default: {
      return <Label>Not found</Label>
    }
  }
}
