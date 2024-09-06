import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  addNewGroup,
  joinExistingGroup,
  setFavouriteGroup,
  deleteExistingGroup,
  renameExistingGroup,
  leaveExistingGroup,
  getGroupMembers,
  getPublicProfiles,
} from '@/utils/supabase/queries'
import type { GroupMembersType, PublicProfilesType, UserGroupsType } from '@/types/dashboard'
import { NotificationMessage, useNotifications } from './use-notifications'
import { useToast } from '@/components/ui/use-toast'

export function useGroupManagement(initialUserGroups: UserGroupsType | null, user: any) {
  const supabase = createClient()
  const { toast } = useToast()
  const [userGroups, setUserGroups] = useState<UserGroupsType>(() => initialUserGroups || [])
  const [groupId, setGroupId] = useState<string | null>(() => {
    if (userGroups && userGroups.length > 0) {
      const favoriteGroup = userGroups.find((group) => group.favourite === true)
      return favoriteGroup?.groups.id || userGroups[0].groups.id || null
    }
    return null
  })

  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(
    userGroups?.find((group) => group.favourite)?.groups.name ||
      userGroups?.[0]?.groups.name ||
      null,
  )
  const { notificationMessage, clearNotification, showNotification } = useNotifications()
  const [groupMembers, setGroupMembers] = useState<GroupMembersType>([])
  const [publicProfiles, setPublicProfiles] = useState<PublicProfilesType>([])

  useEffect(() => {
    if (notificationMessage) {
      toast({
        title: notificationMessage.title,
        description: notificationMessage.message,
        variant: notificationMessage.variant,
      })
      clearNotification()
    }
  }, [notificationMessage, toast, clearNotification])

  useEffect(() => {
    if (userGroups && userGroups.length > 0) {
      const defaultGroup = userGroups.find((group) => group.favourite) || userGroups[0]
      setGroupId(defaultGroup.group_id)
      setSelectedGroupName(defaultGroup.groups.name)
    }
  }, [userGroups])

  const handleOnValueChange = useCallback(
    (value: string) => {
      const selectedGroup = userGroups?.find((group) => group.groups.name === value)
      if (selectedGroup) {
        setGroupId(selectedGroup.group_id)
        setSelectedGroupName(value)
      }
    },
    [userGroups],
  )

  const createGroup = useCallback(
    async (groupName: string) => {
      const { data, error } = await addNewGroup(supabase, user.id, groupName)
      if (error) {
        const errorMessages: {
          [key: string]: NotificationMessage
        } = {
          '23505': {
            title: 'Fehler beim Erstellen der Gruppe',
            message: `Der Gruppenname "${groupName}" ist bereits vergeben.`,
            variant: 'destructive',
          },
        }
        const errorCode = typeof error === 'string' ? error : error.code
        const errorMessage = errorMessages[errorCode] || {
          title: 'Fehler beim Erstellen der Gruppe',
          message:
            'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
          variant: 'destructive',
        }
        showNotification(errorMessage.title, errorMessage.message, errorMessage.variant)
      }
      if (!error && data) {
        setUserGroups((prevUserGroups) => [
          ...prevUserGroups,
          {
            group_id: data.id,
            favourite: true,
            role: 'admin',
            groups: {
              id: data.id,
              name: groupName,
              created_at: data.created_at,
              created_by: data.created_by,
              description: data.description,
            },
          },
        ])
        setGroupId(data.group_id)
        setSelectedGroupName(data.name)
        showNotification(
          'Gruppe erstellt',
          `Die Gruppe "${data.name}" wurde erfolgreich erstellt.`,
          'success',
        )
      }
    },
    [user.id, supabase, showNotification, setUserGroups],
  )

  const joinGroup = useCallback(
    async (inviteCode: string) => {
      const { groupData, error } = await joinExistingGroup(supabase, user.id, inviteCode)
      if (error) {
        const errorMessages: {
          [key: string]: NotificationMessage
        } = {
          '23505': {
            title: 'Fehler beim Beitreten der Gruppe',
            message: `Du bist bereits Teil der Gruppe "${groupData?.name}".`,
            variant: 'destructive',
          },
          '22P02': {
            title: 'Fehler beim Beitreten der Gruppe',
            message: 'Das war kein korrektes Format eines Einladungslinks.',
            variant: 'destructive',
          },
          '23503': {
            title: 'Fehler beim Beitreten der Gruppe',
            message: 'Falscher Einladungslink.',
            variant: 'destructive',
          },
        }
        const errorCode = typeof error === 'string' ? error : error.code
        const errorMessage = errorMessages[errorCode] || {
          title: 'Fehler beim Beitreten der Gruppe',
          message:
            'Es ist ein Fehler beim Beitreten der Gruppe aufgetreten, bitte versuche es später erneut.',
          variant: 'destructive',
        }
        showNotification(errorMessage.title, errorMessage.message, errorMessage.variant)
      }
      if (!error && groupData) {
        setUserGroups((prevUserGroups) => [
          ...prevUserGroups,
          {
            group_id: groupData.id,
            favourite: false,
            role: 'member',
            groups: {
              id: groupData.id,
              name: groupData.name,
              created_at: groupData.created_at,
              created_by: groupData.created_by,
              description: groupData.description,
            },
          },
        ])
        setGroupId(groupData.group_id)
        setSelectedGroupName(groupData.name)
        showNotification(
          'Gruppe beigetreten',
          `Du hast erfolgreich der Gruppe "${groupData.name}" beigetreten.`,
          'success',
        )
      }
    },
    [user.id, supabase, showNotification],
  )

  const leaveGroup = useCallback(
    async (groupIdToLeave: string) => {
      const { error } = await leaveExistingGroup(supabase, user.id, groupIdToLeave)
      if (error) {
        showNotification(
          'Fehler beim Verlassen der Gruppe',
          'Es ist ein Fehler beim Verlassen der Gruppe aufgetreten, bitte versuche es später erneut.',
          'destructive',
        )
      }
      if (!error) {
        setUserGroups((prevUserGroups) =>
          prevUserGroups.filter((group) => group.group_id !== groupIdToLeave),
        )
        setGroupId((prevGroupId) => (prevGroupId === groupIdToLeave ? null : prevGroupId))
        setSelectedGroupName((prevSelectedGroupName) =>
          prevSelectedGroupName === groupIdToLeave ? null : prevSelectedGroupName,
        )
        showNotification(
          'Gruppe verlassen',
          `Du hast erfolgreich die Gruppe "${groupIdToLeave}" verlassen.`,
          'success',
        )
      }
    },
    [user.id, supabase, showNotification],
  )

  const deleteGroup = useCallback(
    async (groupIdToDelete: string) => {
      const { error } = await deleteExistingGroup(supabase, user.id, groupIdToDelete)
      if (error) {
        showNotification(
          'Fehler beim Löschen der Gruppe',
          'Es ist ein Fehler beim Löschen der Gruppe aufgetreten, bitte versuche es später erneut.',
          'destructive',
        )
      }
      if (!error) {
        setUserGroups((prevUserGroups) => {
          const updatedGroups = prevUserGroups.filter((group) => group.group_id !== groupIdToDelete)
          if (updatedGroups.length > 0) {
            const nextGroup = updatedGroups.find((group) => group.favourite) || updatedGroups[0]
            setGroupId(nextGroup.group_id)
            setSelectedGroupName(nextGroup.groups.name)
            showNotification(
              'Gruppe gelöscht',
              `Die Gruppe wurde gelöscht. Sie sind jetzt in der Gruppe "${nextGroup.groups.name}".`,
              'success',
            )
          } else {
            setGroupId(null)
            setSelectedGroupName(null)
            showNotification(
              'Gruppe gelöscht',
              'Die letzte Gruppe wurde gelöscht. Sie sind jetzt in keiner Gruppe mehr.',
              'success',
            )
          }
          return updatedGroups
        })
      }
    },
    [user.id, supabase, showNotification],
  )

  const renameGroup = useCallback(
    async (groupIdToRename: string, newName: string) => {
      const { error } = await renameExistingGroup(supabase, user.id, groupIdToRename, newName)
      if (error) {
        const errorMessages: {
          [key: string]: NotificationMessage
        } = {
          '23505': {
            title: 'Fehler beim Umbennen der Gruppe',
            message: `Der Gruppenname "${newName}" ist bereits vergeben.`,
            variant: 'destructive',
          },
        }
        const errorMessage = errorMessages[error.code] || {
          title: 'Fehler beim Umbennen der Gruppe',
          message:
            'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
          variant: 'destructive',
        }
        showNotification(errorMessage.title, errorMessage.message, errorMessage.variant)
      }
      if (!error) {
        setUserGroups((prev) =>
          prev
            ? prev.map((group) =>
                group.group_id === groupIdToRename
                  ? { ...group, groups: { ...group.groups, name: newName } }
                  : group,
              )
            : [],
        )
        setSelectedGroupName(newName)
        showNotification(
          'Gruppe umbenannt',
          `Die Gruppe wurde erfolgreich in "${newName}" umbenannt.`,
          'success',
        )
      }
    },
    [user.id, supabase, showNotification],
  )

  const setFavourite = useCallback(
    async (groupIdToFavourite: string, isFavourite: boolean) => {
      const { error } = await setFavouriteGroup(supabase, user.id, groupIdToFavourite, isFavourite)
      if (error) {
        showNotification(
          'Fehler beim Setzen der Favoriten',
          'Es ist ein Fehler beim Setzen der Favoriten aufgetreten, bitte versuche es später erneut.',
          'destructive',
        )
      }
      if (!error) {
        setUserGroups((prev) =>
          prev
            ? prev.map((group) =>
                group.group_id === groupIdToFavourite
                  ? { ...group, favourite: isFavourite }
                  : group,
              )
            : [],
        )
      }
    },
    [user.id, supabase, showNotification],
  )

  const getExistingGroupMembers = useCallback(
    async (groupId: string) => {
      const { groupMembers, error } = await getGroupMembers(supabase, groupId)
      if (error) {
        showNotification(
          'Fehler beim Laden der Gruppenmitglieder',
          'Es ist ein Fehler beim Laden der Gruppenmitglieder aufgetreten, bitte versuche es später erneut.',
          'destructive',
        )
      }
      if (!error && groupMembers) {
        setGroupMembers(groupMembers)
      }
    },
    [supabase, showNotification],
  )

  const getExistingPublicProfiles = useCallback(
    async (user_ids: string[]) => {
      const { publicProfiles, error } = await getPublicProfiles(supabase, user_ids)
      if (error) {
        showNotification(
          'Fehler beim Laden der öffentlichen Profile',
          'Es ist ein Fehler beim Laden der öffentlichen Profile aufgetreten, bitte versuche es später erneut.',
          'destructive',
        )
      }
      if (!error && publicProfiles) {
        setPublicProfiles(publicProfiles)
      }
    },
    [supabase, showNotification],
  )

  return {
    publicProfiles,
    groupMembers,
    userGroups,
    groupId,
    selectedGroupName,
    handleOnValueChange,
    createGroup,
    joinGroup,
    deleteGroup,
    leaveGroup,
    renameGroup,
    setFavourite,
    setUserGroups,
    setGroupId,
    setSelectedGroupName,
    getExistingGroupMembers,
    getExistingPublicProfiles,
  }
}
