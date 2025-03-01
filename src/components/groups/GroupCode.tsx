"use client";

import { Button } from "@/components/ui/button";
import { copyToClipboard, showNotification } from "@/lib/utils";
import { UserGroupsType } from "@/types/dashboard";
import { CopyIcon } from "lucide-react";
import { CardTitle } from "../ui/card";

interface GroupCodeProps {
  userGroups: UserGroupsType[];
  groupId: string | null | false;
}

export default function GroupCode({ groupId }: GroupCodeProps) {
  const handleOnCopyClick = (groupId: string) => {
    if (!groupId || groupId === "") {
      showNotification(
        "Fehler beim Kopieren des Einladungscodes",
        "destructive",
        "Der Einladungscode ist leer. Bitte gib einen gültigen Einladungscode ein."
      );
    }
    copyToClipboard(groupId);
    showNotification("Einladungscode kopiert", "success");
  };
  return (
    <div className="flex flex-col gap-4 w-full justify-center">
      <CardTitle className="text-xl">Einladungscode</CardTitle>
      <div className="flex flex-col gap-4 w-full items-center">
        <Button
          onClick={() => handleOnCopyClick(groupId ? groupId : "")}
          className="flex gap-4 text-xs relative pl-10 w-full max-w-lg"
          aria-label="Einladungscode kopieren"
          variant="outline"
        >
          <span className="xs:inline truncate">{groupId}</span>
          <CopyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
