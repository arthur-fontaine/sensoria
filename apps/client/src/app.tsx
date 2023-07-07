import { Label } from '@radix-ui/react-label'

import { Dashboard } from '@/features/dashboard/views/dashboard'
import { Login } from '@/features/login/views/login'
import { Onboarding } from '@/features/onboarding/views/onboarding'
import { Tag } from '@/features/tag/views/tag'
import { Users } from '@/features/users/users'
import { useRoute } from '@/shared/hooks/use-route'

export function App() {
  const route = useRoute([
    'Login',
    'Onboarding',
    'Dashboard',
    'Users',
    'Tag',
  ])

  switch (route?.name) {
    case 'Login': {
      return <Login />
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
