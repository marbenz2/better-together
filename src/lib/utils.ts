import { useToastStore } from '@/stores/toastStore'
import { NotificationVariant } from '@/types/notification'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function copyToClipboard(text: string | number | null | undefined) {
  navigator.clipboard.writeText(text as string)
}

export const showNotification = (
  title: string,
  message: string,
  variant: NotificationVariant,
): void => {
  const toastStore = useToastStore.getState()
  toastStore.clearToast()
  toastStore.showToast(title, message, variant)
  setTimeout(() => {
    toastStore.clearToast()
  }, 3000)
}

export const googleMapsUrl = (
  name: string,
  country: string,
  street: string,
  street_number: number,
  plz: string,
  ort: string,
) => {
  return `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_SEARCH}${name},${country},${street}+${street_number},${plz}+${ort}`
}
