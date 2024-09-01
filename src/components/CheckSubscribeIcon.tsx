"use client";

import { CheckCircleIcon } from "lucide-react";

export default function CheckSubscribeIcon({
  subscribed,
}: {
  subscribed: boolean;
}) {
  return (
    <>
      {subscribed && (
        <CheckCircleIcon
          className="absolute top-2 right-2"
          color="green"
          size={24}
        />
      )}
    </>
  );
}
