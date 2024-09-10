import { updatePaymentStatus } from '@/utils/supabase/queries'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { order_id, payment_type, user_id, trip_id } = await req.json() // Extrahieren Sie die orderID direkt aus dem JSON-Body

  if (!order_id) {
    return NextResponse.json(
      {
        success: false,
        message: 'Please provide orderID',
      },
      { status: 400 },
    )
  }

  try {
    const accessToken = await getAccessToken()
    const capture = await captureOrder(accessToken, order_id)

    if (!capture || !capture.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Some error occurred at backend',
        },
        { status: 500 },
      )
    }

    const transaction_id = capture.id

    if (payment_type && user_id && trip_id) {
      await updatePaymentStatus(user_id, trip_id, payment_type, transaction_id)
    }

    return NextResponse.json(
      {
        success: true,
        data: { capture },
      },
      { status: 200 },
    )
  } catch (err) {
    console.log('Error at Capture Order: ', err)
    return NextResponse.json(
      {
        success: false,
        message: 'Could not capture order',
      },
      { status: 500 },
    )
  }
}

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token
}

async function captureOrder(accessToken, order_id) {
  const response = await fetch(
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${order_id}/capture`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  )

  return response.json()
}
