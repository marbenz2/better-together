import { create } from 'zustand'

interface InitializationState {
  isInitialized: boolean
  setInitialized: (value: boolean) => void
}

export const useInitializationStore = create<InitializationState>((set) => ({
  isInitialized: false,
  setInitialized: (value) => {
    console.log('Setting isInitialized to:', value)
    set({ isInitialized: value })
  },
}))
