'use client'

import FavouriteGroups from './FavouriteGroups'
import GroupCode from './GroupCode'
import CreateGroup from './CreateGroup'
import JoinGroup from './JoinGroup'
import RenameGroup from './RenameGroup'
import DeleteGroup from './DeleteGroup'
import LeaveGroup from './LeaveGroup'
import GroupMembers from './GroupMembers'
import { useGroupStore } from '@/stores/groupStores'

export default function GroupManagement() {
  const { userGroups, groupMembers, groupId } = useGroupStore()

  return (
    <div className="flex flex-col gap-8">
      {/* Favoriten */}
      {userGroups && userGroups.length > 0 && <FavouriteGroups />}
      {/* Gruppenmitglieder */}
      {/* {groupMembers && <GroupMembers />} */}
      {/* Gruppencode */}
      {userGroups && userGroups.length > 0 && (
        <GroupCode userGroups={userGroups} groupId={groupId} />
      )}
      <div className="flex flex-col gap-12 w-full lg:flex-row">
        {/* Gruppen erstellen */}
        <CreateGroup />
        {/* Gruppen beitreten */}
        <JoinGroup />
        {/* Gruppen umbenennen */}
        {userGroups &&
          groupId &&
          userGroups.find((group) => group.group_id === groupId && group.role === 'admin') && (
            <RenameGroup />
          )}
      </div>
      {/* Gruppen verlassen */}
      {userGroups && groupId && <LeaveGroup />}
      {/* Gruppen löschen */}
      {userGroups &&
        groupId &&
        userGroups.find((group) => group.group_id === groupId && group.role === 'admin') && (
          <DeleteGroup />
        )}
    </div>
  )
}
