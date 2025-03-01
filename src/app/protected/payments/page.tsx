"use client";

import Payments from "@/components/payments/Payments";
import { useToast } from "@/hooks/use-toast";
import { usePaymentStore } from "@/stores/paymentStore";
import { useToastStore } from "@/stores/toastStore";
import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";

export default function PaymentPage() {
  const { user, getSubscribedTrips } = useUserStore();
  const { getUserPayments } = usePaymentStore();
  const { toast } = useToast();
  const { title, message, variant } = useToastStore();

  useEffect(() => {
    if (title && variant) {
      toast({
        title,
        variant,
        description: message,
      });
    }
  }, [title, message, variant, toast]);

  useEffect(() => {
    getUserPayments(user.id);
    getSubscribedTrips();
  }, [getUserPayments, getSubscribedTrips, user.id]);

  return <Payments />;
}
