import { create } from 'zustand'

interface InitializationState {
  isInitialized: boolean
  setInitialized: (value: boolean) => void
}

export const useInitializationStore = create<InitializationState>((set) => ({
  isInitialized: false,
  setInitialized: (value) => {
    set({ isInitialized: value })
  },
}))
