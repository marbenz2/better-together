"use client";

import { type ComponentProps, useState, useTransition } from "react";
import { addSubscription, removeSubscription } from "@/lib/actions";
import { Button } from "./ui/button";

type Props = ComponentProps<"button"> & {
  tripId: string;
  subscribed?: boolean;
  allowSubscription?: boolean;
};

export function Subscription({
  tripId,
  subscribed: initialSubscribed,
  allowSubscription,
}: Props) {
  const [subscribed, setSubscribed] = useState(initialSubscribed);

  const handleSubscribe = async () => {
    try {
      await addSubscription({ tripId });
      setSubscribed(true);
    } catch (err) {
      console.error((err as any).message);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await removeSubscription({ tripId });
      setSubscribed(false);
    } catch (err) {
      console.error((err as any).message);
    }
  };

  return subscribed ? (
    <>
      <UnsubscribeButton
        disabled={allowSubscription}
        tripId={tripId}
        onUnsubscribe={handleUnsubscribe}
        allowSubscription={allowSubscription}
      >
        Abmelden
      </UnsubscribeButton>
    </>
  ) : allowSubscription ? (
    <>
      <SubscribeButton tripId={tripId} onSubscribe={handleSubscribe}>
        Anmelden
      </SubscribeButton>
    </>
  ) : (
    <p className="font-bold text-center">
      Die Anmeldung für diese Reise ist bereits geschlossen.
    </p>
  );
}

type ButtonProps = Props & {
  onSubscribe?: () => Promise<void>;
  onUnsubscribe?: () => Promise<void>;
};

function SubscribeButton({ children, onSubscribe }: ButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const handleClick = async () => {
    startTransition(async () => {
      try {
        await onSubscribe?.();
      } catch (err) {
        setError((err as any).message);
      }
    });
  };

  return (
    <>
      <Button onClick={handleClick} disabled={isPending}>
        {isPending ? "Wird angemeldet..." : children}
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}

function UnsubscribeButton({
  allowSubscription,
  children,
  onUnsubscribe,
}: ButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const handleClick = async () => {
    startTransition(async () => {
      try {
        await onUnsubscribe?.();
      } catch (err) {
        setError((err as any).message);
      }
    });
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={(isPending || !allowSubscription) ?? false}
      >
        {isPending && "Wird abgemeldet..."}
        {!allowSubscription && "Bereits gezahlt"}
        {!isPending && allowSubscription && children}
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}
