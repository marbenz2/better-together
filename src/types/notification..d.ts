export type NotificationVariant = 'default' | 'destructive' | 'success'

export interface NotificationMessage {
  title: string
  message: string
  variant: NotificationVariant
}
