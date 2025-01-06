"use client";

import { useEffect, use } from "react";
import { useTripStore } from "@/stores/tripStores";
import { useToast } from "@/hooks/use-toast";
import { useToastStore } from "@/stores/toastStore";
import EditTrip from "@/components/trips/EditTrip";

export default function EditTripPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  const { getTrip } = useTripStore();
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
    if (params.id) {
      getTrip(params.id);
    }
  }, [params.id, getTrip]);

  return <EditTrip />;
}
