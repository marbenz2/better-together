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

// ... vorhandene Importe ...

export function ResponsiveDialog({
  children,
  onDelete,
}: {
  children: React.ReactNode
  onDelete: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleDelete = () => {
    onDelete()
    setOpen(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Gruppe löschen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie diese Gruppe löschen möchten?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 w-full p-4 py-24 items-center justify-center">
            <Button variant="destructive" onClick={handleDelete}>
              Ja ich bin sicher, Gruppe löschen
            </Button>
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
          <DrawerTitle>Gruppe löschen</DrawerTitle>
          <DrawerDescription>
            Sind Sie sicher, dass Sie diese Gruppe löschen möchten?
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 w-full p-4 py-24 items-center justify-center">
          <Button variant="destructive" onClick={handleDelete}>
            Ja ich bin sicher, Gruppe löschen
          </Button>
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
