import { create } from 'zustand'

interface ToastState {
  title: string | null
  variant: 'default' | 'destructive' | 'success' | 'info'
  message: string | undefined
  showToast: (
    title: string,
    variant: 'default' | 'destructive' | 'success' | 'info',
    message?: string,
  ) => void
  clearToast: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  title: null,
  variant: 'default',
  message: undefined,
  showToast: (title, variant, message) => set({ title, variant, message }),
  clearToast: () => set({ title: null, variant: 'default', message: undefined }), // Änderung hier
}))
