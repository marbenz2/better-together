import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { CardDescription } from '@/components/ui/card'
import type { UserGroupsType } from '@/types/dashboard'
import FavouriteGroups from './FavouriteGroups'
import GroupCode from './GroupCode'
import CreateGroup from './CreateGroup'
import JoinGroup from './JoinGroup'
import RenameGroup from './RenameGroup'
import DeleteGroup from './DeleteGroup'

interface GroupManagementProps {
  userGroups: UserGroupsType
  groupId: string | false | null
  createGroup: (groupName: string) => Promise<void>
  joinGroup: (groupId: string) => Promise<void>
  deleteGroup: (groupId: string) => Promise<void>
  renameGroup: (groupId: string, newName: string) => Promise<void>
  setFavourite: (groupId: string, favourite: boolean) => Promise<void>
}

export default function GroupManagement({
  userGroups,
  groupId,
  createGroup,
  joinGroup,
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
            {userGroups && userGroups.length > 0 && (
              <GroupCode userGroups={userGroups} groupId={groupId} />
            )}
            <div className="flex flex-col gap-12 w-full max-w-lg lg:max-w-full lg:flex-row">
              <JoinGroup joinGroup={joinGroup} />
              <CreateGroup createGroup={createGroup} />
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
