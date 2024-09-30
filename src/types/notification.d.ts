export type NotificationVariant = 'default' | 'destructive' | 'success' | 'info'

export interface NotificationMessage {
  title: string
  message: string
  variant: NotificationVariant
}
