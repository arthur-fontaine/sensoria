import { useQuery } from './hooks/use-query'

import { Label } from '@/components/ui/label'
import { useRoute } from '@/hooks/use-route'

export function App() {
  const route = useRoute(['Home'])

  const query = useQuery()

  switch (route?.name) {
    case 'Home': {
      return <Label>{query.greet({ name: route.params.name })}</Label>
    }
    default: {
      return <Label>Not found</Label>
    }
  }
}
