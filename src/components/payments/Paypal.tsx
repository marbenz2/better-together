'use client'

import { useState } from 'react'
import { redirect } from 'next/navigation'

import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from '@paypal/react-paypal-js'
import { showNotification } from '@/lib/utils'

interface OrderData {
  data: {
    order: {
      id: string
      links: { href: string; rel: string; method: string }[]
      payment_source: { type: string; token: string }
      status: string
    }
    success: boolean
  }
}

interface PaypalProps {
  user_id: string
  payment_type: string
  price: number
  trip_id: string
  onPaymentSuccess: () => void
}

export default function Paypal({
  user_id,
  payment_type,
  price,
  trip_id,
  onPaymentSuccess,
}: PaypalProps) {
  const [approvalDetails, setApprovalDetails] = useState<any>(null)

  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  }

  const createOrder: PayPalButtonsComponentProps['createOrder'] = async () => {
    try {
      const response = await fetch('/api/paypal/createorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { price, user_id, payment_type },
        }),
      })

      const orderData: OrderData = await response.json()

      if (!orderData.data.order.id) {
        throw new Error('Failed to create order')
      }

      return orderData.data.order.id
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const onApprove: PayPalButtonsComponentProps['onApprove'] = async (data) => {
    try {
      const response = await fetch('/api/paypal/captureorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: data.orderID,
          payment_type,
          user_id,
          trip_id,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`)
      }

      const {
        data: { capture: details },
      } = await response.json()

      if (!details || details.status !== 'COMPLETED') {
        throw new Error('Zahlung nicht erfolgreich abgeschlossen')
      }

      setApprovalDetails(details)
      onPaymentSuccess()
      showNotification(
        'Zahlung erfolgreich',
        `Zahlungs ID: ${details.id}\n
        Status: ${details.status}\n
        Betrag: ${details.purchase_units[0].payments.captures[0].amount.value} ${details.purchase_units[0].payments.captures[0].amount.currency_code}`,
        'success',
      )
    } catch (error) {
      console.error('Fehler bei der Zahlungsverarbeitung:', error)
      showNotification(
        'Zahlungsfehler',
        'Bei der Verarbeitung Ihrer Zahlung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
        'destructive',
      )
    }
  }

  const onCancel: PayPalButtonsComponentProps['onCancel'] = (data) => {
    showNotification(
      'Zahlung abgebrochen',
      'Zahlung wurde durch den Benutzer abgebrochen',
      'destructive',
    )
    redirect('/payments/ErrorPage')
  }

  const onError: PayPalButtonsComponentProps['onError'] = (err) => {
    showNotification(
      'Zahlungsfehler',
      'Bei der Verarbeitung Ihrer Zahlung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
      'destructive',
    )
    redirect('/payments/ErrorPage')
  }

  const styles: PayPalButtonsComponentProps['style'] = {
    shape: 'rect',
    layout: 'vertical',
    height: 40,
  }

  return (
    <div className="flex w-full justify-center">
      <PayPalScriptProvider options={initialOptions}>
        {!approvalDetails && (
          <PayPalButtons
            className="w-full max-w-xl"
            style={styles}
            createOrder={createOrder}
            onApprove={onApprove}
            onCancel={onCancel}
            onError={onError}
          />
        )}
      </PayPalScriptProvider>
    </div>
  )
}
