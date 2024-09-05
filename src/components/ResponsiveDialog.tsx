import * as React from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

interface ResponsiveDialogProps {
  disabled?: boolean
  type: 'delete' | 'leave'
  groupName?: string
  onDelete?: () => void
  onLeave?: () => void
  children: React.ReactNode
}

export function ResponsiveDialog({
  disabled,
  type,
  groupName,
  onDelete,
  onLeave,
  children,
}: ResponsiveDialogProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
    setOpen(false)
  }

  const handleLeave = () => {
    if (onLeave) {
      onLeave()
    }
    setOpen(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{type === 'delete' ? 'Gruppe löschen' : 'Gruppe verlassen'}</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie diese Gruppe {type === 'delete' ? 'löschen' : 'verlassen'}
              möchten?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 w-full p-4 py-24 items-center justify-center">
            <Button
              disabled={disabled}
              variant="destructive"
              onClick={type === 'delete' ? handleDelete : handleLeave}
            >
              {type === 'delete'
                ? `Ja, Gruppe "${groupName}" löschen`
                : `Ja, Gruppe "${groupName}" verlassen`}
            </Button>
            {disabled && (
              <DialogDescription className="text-sm">
                Du bist der einzige Admin der Gruppe.
                <br />
                Du kannst die Gruppe nur löschen oder einem anderen Nutzer Adminrechte übertragen.
              </DialogDescription>
            )}
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Abbrechen</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{type === 'delete' ? 'Gruppe löschen' : 'Gruppe verlassen'}</DrawerTitle>
          <DrawerDescription>
            Sind Sie sicher, dass Sie diese Gruppe {type === 'delete' ? 'löschen' : 'verlassen'}
            möchten?
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 w-full p-4 py-24 items-center justify-center">
          <Button
            disabled={disabled}
            variant="destructive"
            onClick={type === 'delete' ? handleDelete : handleLeave}
          >
            {type === 'delete'
              ? `Ja, Gruppe "${groupName}" löschen`
              : `Ja, Gruppe "${groupName}" verlassen`}
          </Button>
          {disabled && (
            <DialogDescription className="text-sm">
              Du bist der letzte Admin der Gruppe.
              <br />
              Du kannst die Gruppe nur löschen oder einem anderen Nutzer Adminrechte übertragen.
            </DialogDescription>
          )}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Abbrechen</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
