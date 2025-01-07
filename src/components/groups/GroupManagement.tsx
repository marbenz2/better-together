"use client";

import GroupCode from "./GroupCode";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";
import RenameGroup from "./RenameGroup";
import DeleteGroup from "./DeleteGroup";
import LeaveGroup from "./LeaveGroup";
import GroupMembers from "./GroupMembers";
import { useGroupStore } from "@/stores/groupStores";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { CardTitle } from "../ui/card";

export default function GroupManagement() {
  const { userGroups, groupMembers, groupId } = useGroupStore();
  const isAdmin =
    userGroups &&
    groupId &&
    userGroups.find(
      (group) => group.group_id === groupId && group.role === "admin"
    );

  return (
    <div className="flex flex-col gap-12">
      {isAdmin && userGroups && userGroups.length > 0 && (
        <GroupCode userGroups={userGroups} groupId={groupId} />
      )}
      {/* Favoriten */}
      {/* {userGroups && userGroups.length > 0 && <FavouriteGroups />} */}
      {/* Gruppenmitglieder */}
      {groupMembers && <GroupMembers />}
      {/* Gruppencode */}
      <Accordion type="single" collapsible>
        <AccordionItem className="border-b-0" value="deleteGroup">
          <AccordionTrigger>
            <CardTitle className="text-xl">Gruppenmanagement</CardTitle>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-8 w-full justify-center items-center">
              {/* Gruppen erstellen */}
              <CreateGroup />
              {/* Gruppen beitreten */}
              <JoinGroup />
              {/* Gruppen umbenennen */}
              {userGroups && groupId && isAdmin && <RenameGroup />}
              {/* Gruppen verlassen */}
              {userGroups && groupId && <LeaveGroup />}
              {/* Gruppen löschen */}
              {userGroups && groupId && isAdmin && <DeleteGroup />}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
