"use client";

import { CardBackPlate, CardHeader } from "@/components/ui/card";
import GroupManagement from "../groups/GroupManagement";

export default function Groups() {
  return (
    <CardBackPlate className="flex flex-col max-w-7xl w-full gap-8">
      <CardHeader>
        <GroupManagement />
      </CardHeader>
    </CardBackPlate>
  );
}
