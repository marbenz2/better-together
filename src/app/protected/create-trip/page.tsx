"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useToastStore } from "@/stores/toastStore";
import CreateTrip from "@/components/trips/CreateTrip";

export default function CreateTripPage() {
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

  return <CreateTrip />;
}
