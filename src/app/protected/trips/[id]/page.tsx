"use client";

import { useEffect, useState, use } from "react";
import Trip from "@/components/trip/Trip";
import { useTripStore } from "@/stores/tripStores";
import { usePaymentStore } from "@/stores/paymentStore";
import { useToast } from "@/hooks/use-toast";
import { useToastStore } from "@/stores/toastStore";
import { useUserStore } from "@/stores/userStore";
import { useGroupStore } from "@/stores/groupStores";
import Spinner from "@/components/ui/Spinner";

export default function TripPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { user } = useUserStore();
  const { getAllUserGroups } = useGroupStore();
  const { getTrip, getAvailableSpots } = useTripStore();
  const { getUserPayments } = usePaymentStore();
  const { toast } = useToast();
  const { title, message, variant } = useToastStore();
  const [isLoading, setIsLoading] = useState(true);

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
    async function loadData() {
      if (params.id) {
        setIsLoading(true);
        await Promise.all([
          getTrip(params.id),
          getUserPayments(user.id),
          getAllUserGroups(user.id),
          getAvailableSpots(params.id),
        ]);
        setIsLoading(false);
      }
    }
    loadData();
  }, [
    params.id,
    getTrip,
    getUserPayments,
    getAllUserGroups,
    user.id,
    getAvailableSpots,
  ]);

  if (isLoading) return <Spinner />;

  return <Trip />;
}
