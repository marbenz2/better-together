import { NextResponse } from "next/server";

export async function POST(req) {
  const { data } = await req.json();
  const { price, user_id, payment_type } = data;

  if (!price || !user_id || !payment_type) {
    return NextResponse.json(
      {
        success: false,
        message: "Please provide price and user_id and a reference",
      },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getAccessToken();
    const order = await createOrder(accessToken, price, user_id, payment_type);

    if (!order || !order.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Some error occurred at backend",
        },
        { status: 500 }
      );
    }

    // Your custom code for doing something with order
    // Usually store an order in the database like MongoDB

    return NextResponse.json(
      {
        success: true,
        data: { order },
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error at Create Order: ", err);
    return NextResponse.json(
      {
        success: false,
        message: "Could not create order",
      },
      { status: 500 }
    );
  }
}

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );

  const data = await response.json();
  return data.access_token;
}

async function createOrder(accessToken, price, payment_type, user_id) {
  const response = await fetch(
    "https://api-m.sandbox.paypal.com/v2/checkout/orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: price,
            },
            information: {
              payment_type: payment_type,
              user_id: user_id,
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              payment_method_selected: "PAYPAL",
              brand_name: "EXAMPLE INC",
              locale: "en-US",
              landing_page: "LOGIN",
              shipping_preference: "GET_FROM_FILE",
              user_action: "PAY_NOW",
              return_url: "https://example.com/returnUrl",
              cancel_url: "https://example.com/cancelUrl",
            },
          },
        },
      }),
    }
  );

  const data = await response.json();
  return data;
}
