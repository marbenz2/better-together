import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import { useNotifications } from '@/hooks/use-notifications'
import { copyToClipboard } from '@/lib/utils'
import { UserGroupsType } from '@/types/dashboard'
import { CopyIcon } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface GroupCodeProps {
  userGroups: UserGroupsType
  groupId: string | null | false
}

export default function GroupCode({ userGroups, groupId }: GroupCodeProps) {
  const { toast } = useToast()
  const { notificationMessage, clearNotification, showNotification } = useNotifications()

  useEffect(() => {
    if (notificationMessage) {
      toast({
        title: notificationMessage.title,
        description: notificationMessage.message,
        variant: notificationMessage.variant,
      })
      clearNotification()
    }
  }, [notificationMessage, toast, clearNotification])

  const handleOnCopyClick = (groupId: string) => {
    if (!groupId || groupId === '') {
      showNotification(
        'Fehler beim Kopieren des Einladungscodes',
        'Der Einladungscode ist leer. Bitte geben Sie einen gültigen Einladungscode ein.',
        'destructive',
      )
    }
    copyToClipboard(groupId)
    showNotification(
      'Einladungscode kopiert',
      `Der Einladungscode "${groupId}" wurde in die Zwischenablage kopiert.`,
      'success',
    )
  }
  return (
    <div className="flex flex-col gap-4 w-full justify-center">
      <CardTitle className="text-xl">
        Einladungscode für Gruppe &quot;
        {userGroups.find((group) => group.group_id === groupId)?.groups.name}&quot;
      </CardTitle>
      <Button
        onClick={() => handleOnCopyClick(groupId ? groupId : '')}
        className="flex gap-4 text-xs relative px-10"
        aria-label="Einladungscode kopieren"
        variant="outline"
      >
        <span className="xs:inline truncate">{groupId}</span>
        <CopyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
      </Button>
    </div>
  )
}
