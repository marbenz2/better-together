import { create } from 'zustand'

interface ToastState {
  title: string | null
  message: string | null
  variant: 'default' | 'destructive' | 'success'
  showToast: (
    title: string,
    message: string,
    variant: 'default' | 'destructive' | 'success',
  ) => void
  clearToast: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  title: null,
  message: null,
  variant: 'default',
  showToast: (title, message, variant) => set({ title, message, variant }),
  clearToast: () => set({ title: null, message: null, variant: 'default' }),
}))
