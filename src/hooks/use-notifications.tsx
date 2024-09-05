import { useState, useCallback } from 'react'

export type NotificationVariant = 'default' | 'destructive' | 'success'

export interface NotificationMessage {
  title: string
  message: string
  variant: NotificationVariant
}

export function useNotifications() {
  const [notificationMessage, setNotificationMessage] = useState<NotificationMessage | null>(null)

  const showNotification = useCallback(
    (title: string, message: string, variant: NotificationVariant = 'default') => {
      setNotificationMessage({ title, message, variant })
    },
    [],
  )

  const clearNotification = useCallback(() => {
    setNotificationMessage(null)
  }, [])

  return {
    notificationMessage,
    showNotification,
    clearNotification,
    setNotificationMessage,
  }
}
