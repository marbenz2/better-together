import { createClient } from '@/utils/supabase/client'
import { create } from 'zustand'
import { getPaymentDetails, getPayments, getPaymentStatus } from '@/utils/supabase/queries'
import { PaymentDetailsType, PaymentStatusType, PaymentsType } from '@/types/payment'

interface PaymentState {
  paymentStatus: PaymentStatusType[] | null
  getPaymentStatus: (userId: string, tripId: string) => Promise<void>

  paymentDetails: PaymentDetailsType[] | null
  getPaymentDetails: (userId: string) => Promise<void>

  payments: PaymentsType[] | null
  getPayments: (groupId: string) => Promise<void>
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

    paymentDetails: [],
    getPaymentDetails: async (userId: string) => {
      const { data, error } = await getPaymentDetails(supabase, userId)
      if (error) {
        console.error('Fehler beim Abrufen der Zahlungsdetails:', error)
        return
      }
      set({ paymentDetails: data || [] })
    },

    payments: [],
    getPayments: async (groupId: string) => {
      const { data, error } = await getPayments(supabase, groupId)
      if (error) {
        console.error('Fehler beim Abrufen der Zahlungen:', error)
        return
      }
      set({ payments: data })
    },
  }
})
