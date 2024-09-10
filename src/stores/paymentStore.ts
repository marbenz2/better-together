import { createClient } from '@/utils/supabase/client'
import { create } from 'zustand'
import { getPaymentDetails, getPaymentStatus } from '@/utils/supabase/queries'
import { PaymentDetailsType, PaymentStatusType } from '@/types/payment'

interface PaymentState {
  paymentStatus: PaymentStatusType | null
  getPaymentStatus: (tripId: string) => Promise<void>

  paymentDetails: PaymentDetailsType[] | null
  getPaymentDetails: () => Promise<void>
}

export const usePaymentStore = create<PaymentState>((set) => ({
  paymentStatus: null,
  getPaymentStatus: async (tripId: string) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.error('Kein Benutzer gefunden')
      return
    }
    const { data, error } = await getPaymentStatus(supabase, user.id, tripId)
    if (error) {
      console.error('Fehler beim Abrufen der Zahlungsstatus:', error)
      return
    }
    set({ paymentStatus: data })
  },

  paymentDetails: [],

  getPaymentDetails: async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.error('Kein Benutzer gefunden')
      return
    }
    const { data, error } = await getPaymentDetails(supabase, user.id)
    if (error) {
      console.error('Fehler beim Abrufen der Zahlungsdetails:', error)
      return
    }
    set({ paymentDetails: data || [] })
  },
}))
