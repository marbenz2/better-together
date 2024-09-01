"use client";

import { useState } from "react";
import { redirect } from "next/navigation";

import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { useToast } from "../ui/use-toast";
import { revalidatePath } from "next/cache";

interface OrderData {
  data: {
    order: {
      id: string;
      links: { href: string; rel: string; method: string }[];
      payment_source: { type: string; token: string };
      status: string;
    };
    success: boolean;
  };
}

interface PaypalProps {
  user_id: string;
  payment_type: string;
  price: number;
  trip_id: string;
}

export default function Paypal({
  user_id,
  payment_type,
  price,
  trip_id,
}: PaypalProps) {
  const { toast } = useToast();
  const [approvalDetails, setApprovalDetails] = useState<any>(null);

  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    // Add other options as needed
  };

  const createOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
    try {
      const response = await fetch("/api/paypal/createorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: { price, user_id, payment_type },
        }),
      });

      const orderData: OrderData = await response.json();

      if (!orderData.data.order.id) {
        throw new Error("Failed to create order");
      }

      return orderData.data.order.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data) => {
    try {
      const response = await fetch("/api/paypal/captureorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: data.orderID,
          payment_type: payment_type,
          user_id: user_id,
          trip_id: trip_id,
        }),
      });

      const {
        data: { capture: details },
      } = await response.json();
      setApprovalDetails(details);
      toast({
        variant: "success",
        title: "Zahlung erfolgreich",
        description: (
          <>
            <p>Zahlungs ID: {details.id}</p>
            <p>Status: {details.status}</p>
            <p>
              Betrag:{" "}
              {details.purchase_units[0].payments.captures[0].amount.value}{" "}
              {
                details.purchase_units[0].payments.captures[0].amount
                  .currency_code
              }
            </p>
          </>
        ),
      });
      revalidatePath("/protected/payments");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const onCancel: PayPalButtonsComponentProps["onCancel"] = (data) => {
    alert("Payment cancelled: " + JSON.stringify(data));
    redirect("/payments/ErrorPage");
  };

  const onError: PayPalButtonsComponentProps["onError"] = (err) => {
    alert("An error occurred: " + JSON.stringify(err));
    redirect("/payments/ErrorPage");
  };

  const styles: PayPalButtonsComponentProps["style"] = {
    shape: "rect",
    layout: "vertical",
    height: 40,
  };

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
  );
}
