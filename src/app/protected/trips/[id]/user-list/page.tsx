"use client";

import { useEffect, useMemo, use } from "react";
import { useTripStore } from "@/stores/tripStores";
import { useToast } from "@/hooks/use-toast";
import { useToastStore } from "@/stores/toastStore";
import { useUserStore } from "@/stores/userStore";
import InfoCard from "@/components/ui/info-card";
import { useGroupStore } from "@/stores/groupStores";
import UserList from "@/components/userlist/UserList";

export default function UserListPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  const { trip, getTrip, tripMembers, getTripMembers } = useTripStore();
  const { groupId, getAllTripPublicProfiles } = useGroupStore();
  const { user } = useUserStore();
  const { toast } = useToast();
  const { title, message, variant } = useToastStore();

  const isCreator = trip?.created_by === user?.id;
  const tripMemberIds = useMemo(
    () => tripMembers.map((member) => member.user_id),
    [tripMembers]
  );
  const isTripFromSelectedGroup = trip?.group_id === groupId;

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

  useEffect(() => {
    if (trip?.id) {
      getTripMembers(trip.id);
    }
  }, [trip?.id, getTripMembers]);

  useEffect(() => {
    if (tripMembers.length > 0) {
      getAllTripPublicProfiles(tripMemberIds);
    }
  }, [tripMembers, getAllTripPublicProfiles, tripMemberIds]);

  if (!isCreator || !isTripFromSelectedGroup) {
    return (
      <InfoCard
        title="Keine Berechtigung"
        description="Du hast keine Berechtigung, die Teilnehmerliste zu sehen."
        variant="warning"
      />
    );
  }

  return <UserList />;
}
