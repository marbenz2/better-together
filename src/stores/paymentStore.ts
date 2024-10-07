import { createClient } from '@/utils/supabase/client'
import { create } from 'zustand'
import { getPaymentStatus } from '@/utils/supabase/queries'
import { PaymentStatusType } from '@/types/payment'

interface PaymentState {
  paymentStatus: PaymentStatusType | null
  getPaymentStatus: (userId: string, tripId: string) => Promise<void>
}

export const usePaymentStore = create<PaymentState>((set) => {
  const supabase = createClient()

  return {
    paymentStatus: null,
    getPaymentStatus: async (userId: string, tripId: string) => {
      const { data, error } = await getPaymentStatus(supabase, userId, tripId)
      if (error) {
        console.error('Fehler beim Abrufen der Zahlungsstatus:', error)
        return
      }
      set({ paymentStatus: data })
    },
  }
})
