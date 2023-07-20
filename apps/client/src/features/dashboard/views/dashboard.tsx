import { ObjectModal } from '@/features/dashboard/components/object-modal'
import { Label } from '@/shared/components/ui/label'

export function Dashboard() {

  return (
    <>
      <Label>Dashboard</Label> <br />
      <ObjectModal id={1} />
    </>
  )
}
