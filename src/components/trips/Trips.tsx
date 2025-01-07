"use client";

import TripCard from "@/components/trip/TripCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CardBackPlate,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useUserStore } from "@/stores/userStore";
import { useTripStore } from "@/stores/tripStores";
import type { Trips } from "@/types/supabase";
import { ExtendedTrip } from "@/types/trips";
import CheckSubscribeIcon from "../CheckSubscribeIcon";
import { setTripStatus } from "@/utils/supabase/queries";
import { PlusIcon } from "lucide-react";
import { ButtonLink } from "../ui/button-link";

export default function Trips() {
  const { user, subscribedTrips } = useUserStore();
  const { groupTrips } = useTripStore();

  const extendedGroupTrips = groupTrips?.map((groupTrip) => {
    const subscribedTrip = subscribedTrips?.find(
      (subscribedTrip) => subscribedTrip.trips.id === groupTrip.id
    );
    return {
      ...groupTrip,
      subscribed_at: subscribedTrip?.subscribed_at,
    };
  });

  const sortedTrips = extendedGroupTrips?.sort(
    (a, b) => new Date(a.date_from).getTime() - new Date(b.date_from).getTime()
  );

  const today = new Date();

  const checkAndSetStatus = async (
    trip: Trips,
    status: "upcoming" | "current" | "done",
    userId: string
  ) => {
    if (trip.status !== status) {
      try {
        await setTripStatus(trip.id, userId, status);
      } catch (err) {
        console.error("Fehler beim Aktualisieren des Trip-Status:", err);
      }
    }
  };

  const upcomingTrips = sortedTrips?.filter((trip) => {
    const isUpcoming = new Date(trip.date_from) > today;
    if (isUpcoming) {
      checkAndSetStatus(trip, "upcoming", user.id);
    }
    return isUpcoming;
  });

  const currentTrips = sortedTrips?.filter((trip) => {
    const isCurrent =
      new Date(trip.date_from) <= today && new Date(trip.date_to) >= today;
    if (isCurrent) {
      checkAndSetStatus(trip, "current", user.id);
    }
    return isCurrent;
  });

  const pastTrips = sortedTrips?.filter((trip) => {
    const isPast = new Date(trip.date_to) < today;
    if (isPast) {
      checkAndSetStatus(trip, "done", user.id);
    }
    return isPast;
  });

  const renderTrips = (trips: ExtendedTrip[]) =>
    trips.map((trip) => {
      return (
        <TripCard trip={trip} key={trip.id} subscribed_at={trip.subscribed_at}>
          <CheckSubscribeIcon subscribed={trip.subscribed_at ? true : false} />
        </TripCard>
      );
    });

  return (
    <div className="flex flex-col gap-12 max-w-7xl w-full mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        <CardBackPlate className="flex-1">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-6">
            <CardTitle>Anstehende Reisen</CardTitle>
            <ButtonLink
              className="w-full xs:w-fit"
              href={"/protected/create-trip"}
              label="Reise erstellen"
            >
              <PlusIcon className="w-4 h-4" />
            </ButtonLink>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row flex-wrap gap-12 sm:gap-4 pt-1">
            {upcomingTrips &&
              upcomingTrips.length === 0 &&
              currentTrips &&
              currentTrips.length === 0 && (
                <CardDescription>
                  In dieser Gruppe gibt es noch keine anstehenden Reisen.
                </CardDescription>
              )}
            {currentTrips && renderTrips(currentTrips as ExtendedTrip[])}
            {upcomingTrips && renderTrips(upcomingTrips as ExtendedTrip[])}
          </CardContent>
        </CardBackPlate>
      </div>
      <CardBackPlate>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <CardHeader>
              <AccordionTrigger className="py-0">
                <CardTitle>Vergangene Reisen</CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent className="flex flex-col sm:flex-row flex-wrap gap-12 sm:gap-4 pt-1">
                {pastTrips && pastTrips.length === 0 && (
                  <CardDescription>
                    In dieser Gruppe gibt es noch keine vergangenen Reisen.
                  </CardDescription>
                )}
                {pastTrips && renderTrips(pastTrips as ExtendedTrip[])}
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardBackPlate>
    </div>
  );
}
