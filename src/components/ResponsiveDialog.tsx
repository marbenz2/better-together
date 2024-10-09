'use client'

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
import InfoCard from '@/components/ui/info-card'

interface ResponsiveDialogProps {
  disabled?: boolean
  title: string
  message: string
  messageComponent?: React.ReactNode
  confirmText?: string
  onConfirm?: () => void
  onCancel?: () => void
  disabledDescription?: string
  info?: string
  infoType?: 'warning' | 'info' | 'success'
  children: React.ReactNode
  buttonVariant?: 'destructive' | 'outline'
}

export function ResponsiveDialog({
  disabled,
  title,
  message,
  messageComponent,
  confirmText,
  onConfirm,
  onCancel,
  disabledDescription,
  info,
  infoType,
  children,
  buttonVariant,
}: ResponsiveDialogProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleConfirm = () => {
    onConfirm?.()
    setOpen(false)
  }

  const handleCancel = () => {
    onCancel?.()
    setOpen(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] gap-12">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            {messageComponent && messageComponent}
            {disabled && disabledDescription && (
              <InfoCard description={disabledDescription} variant="info" />
            )}
            {info && <InfoCard description={info} variant={infoType} />}
          </div>
          <DialogFooter>
            <div
              className={`flex w-full gap-4 ${confirmText && onConfirm ? 'justify-between' : 'justify-end'}`}
            >
              {confirmText && onConfirm && (
                <Button disabled={disabled} variant={buttonVariant} onClick={handleConfirm}>
                  {confirmText}
                </Button>
              )}
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCancel}>
                  {confirmText && onConfirm ? 'Abbrechen' : 'Schließen'}
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className=" gap-12">
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{message}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col items-center justify-center p-4">
          {messageComponent && messageComponent}
          {disabled && disabledDescription && (
            <InfoCard description={disabledDescription} variant="info" />
          )}
          {info && <InfoCard description={info} variant={infoType} />}
        </div>
        <DrawerFooter className="pt-2">
          <div className="flex flex-col w-full gap-4">
            {confirmText && onConfirm && (
              <Button
                className="w-full"
                disabled={disabled}
                variant={buttonVariant}
                onClick={handleConfirm}
              >
                {confirmText}
              </Button>
            )}

            <DrawerClose asChild>
              <Button variant="outline" onClick={handleCancel}>
                {confirmText && onConfirm ? 'Abbrechen' : 'Schließen'}
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
