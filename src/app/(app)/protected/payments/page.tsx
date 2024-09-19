'use client'

import Payments from '@/components/payments/Payments'
import { useToast } from '@/components/ui/use-toast'
import { usePaymentStore } from '@/stores/paymentStore'
import { useToastStore } from '@/stores/toastStore'
import { useUserStore } from '@/stores/userStore'
import { useEffect } from 'react'

export default function PaymentPage() {
  const { getSubscribedTrips } = useUserStore()
  const { getPaymentDetails } = usePaymentStore()
  const { toast } = useToast()
  const { title, message, variant } = useToastStore()

  useEffect(() => {
    if (title && message && variant) {
      toast({
        title,
        description: message,
        variant,
      })
    }
  }, [title, message, variant, toast])

  useEffect(() => {
    getPaymentDetails()
    getSubscribedTrips()
  }, [getPaymentDetails, getSubscribedTrips])

  return <Payments />
}
