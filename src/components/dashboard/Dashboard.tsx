"use client";

import {
  CardBackPlate,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FilteredSubscribedTrips from "./FilteredSubscribedTrips";
import { useUserStore } from "@/stores/userStore";
import Spinner from "@/components/ui/Spinner";
import { useGroupStore } from "@/stores/groupStores";

export default function Dashboard() {
  const { publicProfile } = useUserStore();
  const { userGroups } = useGroupStore();

  return (
    <CardBackPlate className="flex flex-col max-w-7xl w-full gap-12">
      <CardHeader>
        <CardTitle className="text-2xl">
          Hallo {publicProfile ? publicProfile?.first_name : <Spinner />}!
        </CardTitle>
        <CardDescription>
          Hier findest du alle Informationen zu deinen Reisen.
        </CardDescription>
      </CardHeader>
      {userGroups && userGroups.length > 0 && (
        <CardContent className="flex flex-col gap-4">
          <CardTitle>Angemeldete Reisen:</CardTitle>
          <FilteredSubscribedTrips />
        </CardContent>
      )}
    </CardBackPlate>
  );
}
