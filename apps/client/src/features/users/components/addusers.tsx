import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

export function DialogAddUser() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Inviter un collaborateur</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inviter un collaborateur</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="Username" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Email
            </Label>
            <Input id="name" value="exemple@gmail.com"
              className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
