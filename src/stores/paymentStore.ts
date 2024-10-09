import { createClient } from '@/utils/supabase/client'
import { create } from 'zustand'
import { getUserPayments } from '@/utils/supabase/queries'
import { UserPaymentsType } from '@/types/payment'

interface PaymentState {
  userPayments: UserPaymentsType[] | null
  getUserPayments: (userId: string) => Promise<void>
}

export const usePaymentStore = create<PaymentState>((set) => {
  const supabase = createClient()

  return {
    userPayments: null,
    getUserPayments: async (userId: string) => {
      const { data, error } = await getUserPayments(supabase, userId)
      if (error) {
        console.error('Fehler beim Abrufen der Zahlungsdaten:', error)
        return
      }
      set({ userPayments: data })
    },
  }
})
