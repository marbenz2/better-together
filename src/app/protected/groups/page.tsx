"use client";

import { useEffect } from "react";
import Groups from "@/components/groups/Groups";
import { useToast } from "@/hooks/use-toast";
import { useToastStore } from "@/stores/toastStore";

export default function GroupsPage() {
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

  return <Groups />;
}
