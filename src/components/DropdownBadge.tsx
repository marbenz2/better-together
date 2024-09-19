import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ArrowDownIcon } from 'lucide-react'
import { useGroupStore } from '@/stores/groupStores'

import { cn, showNotification } from '@/lib/utils'
import { ResponsiveDialog } from './ResponsiveDialog'

interface DropdownBadgeProps extends React.HTMLProps<HTMLDivElement> {
  isAdmin: boolean
  userId: string
  groupId: string
}

export default function DropdownBadge({
  children,
  isAdmin,
  userId,
  groupId,
  ...props
}: DropdownBadgeProps) {
  const { removeUserFromGroup, makeUserAdmin, removeUserAdmin, groupMembers } = useGroupStore()
  const [isOpen, setIsOpen] = React.useState(false)

  const isChosenUserAdmin =
    groupMembers.find((member) => member.user_id === userId)?.role === 'admin'

  const handleOnClick = () => {
    setIsOpen((prev) => !prev)
  }

  const preventClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleOnClickAddAdmin = () => {
    if (!isAdmin) {
      return
    }
    if (isChosenUserAdmin) {
      showNotification('Info', 'Der Benutzer ist bereits ein Admin', 'info')
    } else {
      makeUserAdmin(userId, groupId)
    }
    setIsOpen(false)
  }

  const handleOnClickRemoveAdmin = () => {
    if (!isAdmin) {
      return
    }
    if (!isChosenUserAdmin) {
      showNotification('Info', 'Der Benutzer ist kein Admin', 'info')
    } else {
      removeUserAdmin(userId, groupId)
    }
    setIsOpen(false)
  }

  const handleOnClickRemoveUser = () => {
    if (!isAdmin) {
      return
    }
    if (isChosenUserAdmin) {
      showNotification('Info', 'Der Benutzer ist ein Admin', 'info')
    } else {
      removeUserFromGroup(userId, groupId)
    }
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Badge
          className={cn('bg-primary text-white cursor-pointer gap-2', props.className)}
          onClick={handleOnClick}
        >
          {children}
          <ArrowDownIcon
            size={14}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom">
        {isAdmin ? (
          <>
            <ResponsiveDialog
              title="Admin hinzufügen"
              message="Möchtest du diesen Benutzer wirklich zu einem Admin machen?"
              confirmText="Admin hinzufügen"
              onConfirm={handleOnClickAddAdmin}
            >
              <DropdownMenuItem
                onSelect={(e) => {
                  preventClose(e as unknown as React.MouseEvent)
                }}
              >
                Admin hinzufügen
              </DropdownMenuItem>
            </ResponsiveDialog>

            <ResponsiveDialog
              title="Admin entfernen"
              message="Möchtest du diesem Benutzer wirklich die Admin-Rechte entziehen?"
              confirmText="Admin entfernen"
              buttonVariant="destructive"
              onConfirm={handleOnClickRemoveAdmin}
            >
              <DropdownMenuItem
                onSelect={(e) => {
                  preventClose(e as unknown as React.MouseEvent)
                }}
              >
                Admin entfernen
              </DropdownMenuItem>
            </ResponsiveDialog>
            <ResponsiveDialog
              title="Benutzer aus Gruppe entfernen"
              message="Möchtest du diesen Benutzer wirklich aus der Gruppe entfernen?"
              confirmText="Benutzer aus Gruppe entfernen"
              buttonVariant="destructive"
              onConfirm={handleOnClickRemoveUser}
            >
              <DropdownMenuItem onSelect={(e) => preventClose(e as unknown as React.MouseEvent)}>
                Benutzer aus Gruppe entfernen
              </DropdownMenuItem>
            </ResponsiveDialog>
          </>
        ) : (
          <DropdownMenuItem>Benutzer aus Gruppe entfernen</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
