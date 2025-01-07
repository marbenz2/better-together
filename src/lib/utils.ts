import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useToastStore } from "@/stores/toastStore";
import { NotificationVariant } from "@/types/notification";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string | number | null | undefined) {
  navigator.clipboard.writeText(text as string);
}

export const showNotification = (
  title: string,
  variant: NotificationVariant,
  message?: string
): void => {
  const toastStore = useToastStore.getState();
  toastStore.clearToast();
  toastStore.showToast(title, variant, message);
  setTimeout(() => {
    toastStore.clearToast();
  }, 50);
};

export const googleMapsUrl = (
  name: string,
  country: string,
  street: string,
  street_number: number,
  plz: string,
  ort: string
) => {
  return `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_SEARCH}${name},${country},${street}+${street_number},${plz}+${ort}`;
};
