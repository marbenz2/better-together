import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CardDescription } from '@/components/ui/card'
import type { GroupMembersType, PublicProfilesType, UserGroupsType } from '@/types/dashboard'
import FavouriteGroups from './FavouriteGroups'
import GroupCode from './GroupCode'
import CreateGroup from './CreateGroup'
import JoinGroup from './JoinGroup'
import RenameGroup from './RenameGroup'
import DeleteGroup from './DeleteGroup'
import LeaveGroup from './LeaveGroup'
import GroupMembers from './GroupMembers'

interface GroupManagementProps {
  user: any
  publicProfiles: PublicProfilesType
  groupMembers: GroupMembersType
  userGroups: UserGroupsType
  groupId: string | null
  createGroup: (groupName: string) => Promise<void>
  joinGroup: (groupId: string) => Promise<void>
  deleteGroup: (groupId: string) => Promise<void>
  leaveGroup: (groupId: string) => Promise<void>
  renameGroup: (groupId: string, newName: string) => Promise<void>
  setFavourite: (groupId: string, favourite: boolean) => Promise<void>
}

export default function GroupManagement({
  user,
  publicProfiles,
  groupMembers,
  userGroups,
  groupId,
  createGroup,
  joinGroup,
  leaveGroup,
  deleteGroup,
  renameGroup,
  setFavourite,
}: GroupManagementProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem className="border-b-0" value="Gruppenmanagement">
        <AccordionTrigger>
          <CardDescription>Gruppenmanagement</CardDescription>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-8">
            {/* Favoriten */}
            {userGroups && userGroups.length > 0 && (
              <FavouriteGroups userGroups={userGroups} setFavouriteGroup={setFavourite} />
            )}
            {/* Gruppenmitglieder */}
            {userGroups && userGroups.length > 0 && (
              <GroupMembers
                publicProfiles={publicProfiles}
                groupMembers={groupMembers}
                groupId={groupId}
              />
            )}
            {/* Gruppencode */}
            {userGroups && userGroups.length > 0 && (
              <GroupCode userGroups={userGroups} groupId={groupId} />
            )}
            <div className="flex flex-col gap-12 w-full max-w-lg lg:max-w-full lg:flex-row">
              {/* Gruppen erstellen */}
              <CreateGroup createGroup={createGroup} />
              {/* Gruppen beitreten */}
              <JoinGroup joinGroup={joinGroup} />
              {/* Gruppen umbenennen */}
              {userGroups &&
                groupId &&
                userGroups.find(
                  (group) => group.group_id === groupId && group.role === 'admin',
                ) && (
                  <RenameGroup
                    userGroups={userGroups}
                    groupId={groupId}
                    renameGroup={renameGroup}
                  />
                )}
            </div>
            {/* Gruppen verlassen */}
            {userGroups && groupId && (
              <LeaveGroup
                user={user}
                leaveGroup={leaveGroup}
                groupId={groupId}
                userGroups={userGroups}
                groupMembers={groupMembers}
              />
            )}
            {/* Gruppen löschen */}
            {userGroups &&
              groupId &&
              userGroups.find((group) => group.group_id === groupId && group.role === 'admin') && (
                <DeleteGroup userGroups={userGroups} groupId={groupId} deleteGroup={deleteGroup} />
              )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
