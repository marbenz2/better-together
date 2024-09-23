import { create } from 'zustand'
import { createClient } from '@/utils/supabase/client'
import type { GroupMembersType, PublicProfilesType, UserGroupsType } from '@/types/dashboard'
import {
  addNewGroup,
  joinExistingGroup,
  setFavouriteGroup,
  deleteExistingGroup,
  renameExistingGroup,
  leaveExistingGroup,
  getGroupMembers,
  getPublicProfiles,
  getUser,
  getUserGroups,
  removeUserFromGroup,
  makeUserAdmin,
  removeUserAdmin,
} from '@/utils/supabase/queries'
import { NotificationMessage } from '@/types/notification.'
import { showNotification } from '@/lib/utils'

interface GroupState {
  userGroups: UserGroupsType
  groupId: string | null
  selectedGroupName: string | null
  groupMembers: GroupMembersType
  publicProfiles: PublicProfilesType[]
  tripPublicProfiles: PublicProfilesType[]
  groupPublicProfiles: PublicProfilesType[]
  setUserGroups: (userGroups: UserGroupsType) => void
  setGroupId: (groupId: string | null) => void
  setSelectedGroupName: (name: string | null) => void
  handleOnValueChange: (value: string) => void
  createGroup: (groupName: string) => Promise<void>
  joinGroup: (inviteCode: string) => Promise<void>
  leaveGroup: (groupIdToLeave: string) => Promise<void>
  deleteGroup: (groupIdToDelete: string) => Promise<void>
  renameGroup: (groupIdToRename: string, newName: string) => Promise<void>
  setFavourite: (groupIdToFavourite: string, isFavourite: boolean) => Promise<void>
  getAllGroupMembers: (groupId: string) => Promise<void>
  getAllPublicProfiles: (user_ids: string[]) => Promise<void>
  getAllTripPublicProfiles: (user_ids: string[]) => Promise<void>
  getAllGroupPublicProfiles: (user_ids: string[]) => Promise<void>
  getAllUserGroups: (userId: string) => Promise<void>
  removeUserFromGroup: (userId: string, groupId: string) => Promise<void>
  makeUserAdmin: (userId: string, groupId: string) => Promise<void>
  removeUserAdmin: (userId: string, groupId: string) => Promise<void>
}

const handleError = (error: any, defaultTitle: string, defaultMessage: string) => {
  const errorMessages: { [key: string]: NotificationMessage } = {
    '23505': {
      title: 'Fehler',
      message: 'Dieser Name ist bereits vergeben.',
      variant: 'destructive',
    },
    '22P02': {
      title: 'Fehler',
      message: 'Das war kein korrektes Format eines Einladungslinks.',
      variant: 'destructive',
    },
    '23503': {
      title: 'Fehler',
      message: 'Falscher Einladungslink.',
      variant: 'destructive',
    },
  }

  const errorCode = error?.code || 'unknown'
  const errorMessage = errorMessages[errorCode] || {
    title: defaultTitle,
    message: defaultMessage,
    variant: 'destructive',
  }

  showNotification(errorMessage.title, errorMessage.message, errorMessage.variant)
}

export const useGroupStore = create<GroupState>((set, get) => ({
  userGroups: [],
  groupId: null,
  selectedGroupName: null,
  groupMembers: [],
  publicProfiles: [],
  tripPublicProfiles: [],
  groupPublicProfiles: [],

  setGroupId: (groupId) => set((state) => ({ ...state, groupId })),
  setSelectedGroupName: (name) => set((state) => ({ ...state, selectedGroupName: name })),
  setUserGroups: (userGroups) => set((state) => ({ ...state, userGroups })),

  handleOnValueChange: (value) => {
    const { userGroups } = get()
    const selectedGroup = userGroups?.find((group) => group.groups.name === value)
    if (selectedGroup) {
      set((state) => ({
        ...state,
        groupId: selectedGroup.group_id,
        selectedGroupName: value,
      }))
    }
  },

  createGroup: async (groupName) => {
    try {
      const supabase = createClient()
      const { data: user } = await getUser(supabase)
      if (!user) {
        console.error('Kein Benutzer gefunden')
        return
      }
      const { data: group, error } = await addNewGroup(supabase, user.id, groupName)
      if (error) throw error

      if (group && !error) {
        set((state) => ({
          userGroups: [
            ...state.userGroups,
            {
              group_id: group.id,
              favourite: true,
              role: 'admin',
              groups: {
                id: group.id,
                name: groupName,
                created_at: group.created_at,
                created_by: group.created_by,
                description: group.description,
              },
            },
          ],
          groupId: group.id,
          selectedGroupName: group.name,
          groupMembers: [],
        }))
        showNotification(
          'Gruppe erstellt',
          `Die Gruppe "${group.name}" wurde erfolgreich erstellt.`,
          'success',
        )
      }
    } catch (error) {
      handleError(
        error,
        'Fehler beim Erstellen der Gruppe',
        'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
      )
    }
  },

  joinGroup: async (inviteCode) => {
    try {
      const supabase = createClient()
      const { data: user } = await getUser(supabase)
      if (!user) {
        console.error('Kein Benutzer gefunden')
        return
      }
      const { data: group, error } = await joinExistingGroup(supabase, user.id, inviteCode)
      if (error) throw error
      if (group && !error) {
        set((state) => ({
          userGroups: [
            ...state.userGroups,
            {
              group_id: group.id,
              favourite: false,
              role: 'member',
              groups: {
                id: group.id,
                name: group.name,
                created_at: group.created_at,
                created_by: group.created_by,
                description: group.description,
              },
            },
          ],
          groupId: group.id,
          selectedGroupName: group.name,
          groupMembers: [],
        }))
        showNotification(
          'Gruppe beigetreten',
          `Du hast erfolgreich der Gruppe "${group.name}" beigetreten.`,
          'success',
        )
      }
    } catch (error) {
      handleError(
        error,
        'Fehler beim Beitreten der Gruppe',
        'Es ist ein Fehler beim Beitreten der Gruppe aufgetreten, bitte versuche es später erneut.',
      )
    }
  },

  leaveGroup: async (groupIdToLeave) => {
    try {
      const supabase = createClient()
      const { data: user } = await getUser(supabase)
      if (!user) {
        console.error('Kein Benutzer gefunden')
        return
      }
      const { error } = await leaveExistingGroup(supabase, user.id, groupIdToLeave)
      if (error) throw error

      set((state) => ({
        userGroups: state.userGroups.filter((group) => group.group_id !== groupIdToLeave),
        groupId: state.groupId === groupIdToLeave ? null : state.groupId,
        selectedGroupName:
          state.selectedGroupName === groupIdToLeave ? null : state.selectedGroupName,
        groupMembers: undefined,
      }))

      showNotification(
        'Gruppe verlassen',
        `Du hast erfolgreich die Gruppe "${groupIdToLeave}" verlassen.`,
        'success',
      )
    } catch (error) {
      handleError(
        error,
        'Fehler beim Verlassen der Gruppe',
        'Es ist ein Fehler beim Verlassen der Gruppe aufgetreten, bitte versuche es später erneut.',
      )
    }
  },

  deleteGroup: async (groupIdToDelete) => {
    try {
      const supabase = createClient()
      const { data: user } = await getUser(supabase)
      if (!user) {
        console.error('Kein Benutzer gefunden')
        return
      }
      const { error } = await deleteExistingGroup(supabase, user.id, groupIdToDelete)
      if (error) throw error

      set((state) => {
        const updatedGroups = state.userGroups.filter((group) => group.group_id !== groupIdToDelete)
        let newGroupId = state.groupId
        let newSelectedGroupName = state.selectedGroupName

        if (updatedGroups.length > 0) {
          const nextGroup = updatedGroups.find((group) => group.favourite) || updatedGroups[0]
          newGroupId = nextGroup.group_id
          newSelectedGroupName = nextGroup.groups.name
          showNotification(
            'Gruppe gelöscht',
            `Die Gruppe wurde gelöscht. Sie sind jetzt in der Gruppe "${nextGroup.groups.name}".`,
            'success',
          )
        } else {
          newGroupId = null
          newSelectedGroupName = null
          showNotification(
            'Gruppe gelöscht',
            'Die letzte Gruppe wurde gelöscht. Sie sind jetzt in keiner Gruppe mehr.',
            'success',
          )
        }

        return {
          userGroups: updatedGroups,
          groupId: newGroupId,
          selectedGroupName: newSelectedGroupName,
          groupMembers: undefined,
        }
      })
    } catch (error) {
      handleError(
        error,
        'Fehler beim Löschen der Gruppe',
        'Es ist ein Fehler beim Löschen der Gruppe aufgetreten, bitte versuche es später erneut.',
      )
    }
  },

  renameGroup: async (groupIdToRename, newName) => {
    try {
      const supabase = createClient()
      const { data: user } = await getUser(supabase)
      if (!user) {
        console.error('Kein Benutzer gefunden')
        return
      }
      const { error } = await renameExistingGroup(supabase, user.id, groupIdToRename, newName)
      if (error) throw error
      set((state) => ({
        userGroups: state.userGroups.map((group) =>
          group.group_id === groupIdToRename
            ? { ...group, groups: { ...group.groups, name: newName } }
            : group,
        ),
        selectedGroupName: newName,
      }))
      showNotification(
        'Gruppe umbenannt',
        `Die Gruppe wurde erfolgreich in "${newName}" umbenannt.`,
        'success',
      )
    } catch (error) {
      handleError(
        error,
        'Fehler beim Umbennen der Gruppe',
        'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
      )
    }
  },

  setFavourite: async (groupIdToFavourite, isFavourite) => {
    try {
      const supabase = createClient()
      const { data: user } = await getUser(supabase)
      if (!user) {
        console.error('Kein Benutzer gefunden')
        return
      }
      const { error } = await setFavouriteGroup(supabase, user.id, groupIdToFavourite, isFavourite)
      if (error) throw error

      set((state) => ({
        userGroups: state.userGroups.map((group) =>
          group.group_id === groupIdToFavourite ? { ...group, favourite: isFavourite } : group,
        ),
      }))

      showNotification(
        'Favoriten gesetzt',
        `Die Gruppe wurde erfolgreich als Favorit ${isFavourite ? 'gesetzt' : 'entfernt'}.`,
        'success',
      )
    } catch (error) {
      handleError(
        error,
        'Fehler beim Setzen der Favoriten',
        'Es ist ein Fehler beim Setzen der Favoriten aufgetreten, bitte versuche es später erneut.',
      )
    }
  },

  getAllGroupMembers: async (groupId) => {
    try {
      const supabase = createClient()
      const { data, error } = await getGroupMembers(supabase, groupId)
      if (error) throw error
      set({ groupMembers: data || [] })
    } catch (error) {
      handleError(
        error,
        'Fehler beim Laden der Gruppenmitglieder',
        'Es ist ein Fehler beim Laden der Gruppenmitglieder aufgetreten, bitte versuche es später erneut.',
      )
    }
  },

  getAllPublicProfiles: async (user_ids) => {
    try {
      const supabase = createClient()
      const { data, error } = await getPublicProfiles(supabase, user_ids)
      if (error) throw error

      set({ publicProfiles: data || [] })
    } catch (error) {
      handleError(
        error,
        'Fehler beim Laden der öffentlichen Profile',
        'Es ist ein Fehler beim Laden der öffentlichen Profile aufgetreten, bitte versuche es später erneut.',
      )
    }
  },

  getAllTripPublicProfiles: async (user_ids) => {
    try {
      const supabase = createClient()
      const { data, error } = await getPublicProfiles(supabase, user_ids)
      if (error) throw error

      set({ tripPublicProfiles: data || [] })
    } catch (error) {
      handleError(
        error,
        'Fehler beim Laden der öffentlichen Profile',
        'Es ist ein Fehler beim Laden der öffentlichen Profile aufgetreten, bitte versuche es später erneut.',
      )
    }
  },

  getAllGroupPublicProfiles: async (user_ids) => {
    try {
      const supabase = createClient()
      const { data, error } = await getPublicProfiles(supabase, user_ids)
      if (error) throw error

      set({ groupPublicProfiles: data || [] })
    } catch (error) {
      handleError(
        error,
        'Fehler beim Laden der öffentlichen Profile',
        'Es ist ein Fehler beim Laden der öffentlichen Profile aufgetreten, bitte versuche es später erneut.',
      )
    }
  },

  getAllUserGroups: async (userId) => {
    try {
      const supabase = createClient()
      const { data, error } = await getUserGroups(supabase, userId)
      if (error) throw error

      set({ userGroups: data as unknown as UserGroupsType })
    } catch (error) {
      handleError(
        error,
        'Fehler beim Laden der Gruppen',
        'Es ist ein Fehler beim Laden der Gruppen aufgetreten, bitte versuche es später erneut.',
      )
    }
  },

  removeUserFromGroup: async (userId, groupId) => {
    try {
      const supabase = createClient()
      const { error } = await removeUserFromGroup(supabase, userId, groupId)
      if (error) throw error
      set((state) => ({
        groupMembers: state.groupMembers.filter((member) => member.user_id !== userId),
      }))
      showNotification('Benutzer entfernt', 'Der Benutzer wurde erfolgreich entfernt.', 'success')
    } catch (error) {
      handleError(
        error,
        'Fehler beim Entfernen des Benutzers',
        'Es ist ein Fehler beim Entfernen des Benutzers aufgetreten, bitte versuche es später erneut.',
      )
    }
  },

  makeUserAdmin: async (userId, groupId) => {
    try {
      const supabase = createClient()
      const { error } = await makeUserAdmin(supabase, userId, groupId)
      if (error) throw error
      set((state) => ({
        groupMembers: state.groupMembers.map((member) =>
          member.user_id === userId ? { ...member, role: 'admin' } : member,
        ),
      }))
      showNotification(
        'Admin gesetzt',
        'Der Benutzer wurde erfolgreich zum Admin ernannt.',
        'success',
      )
    } catch (error) {
      handleError(
        error,
        'Fehler beim Setzen des Admins',
        'Es ist ein Fehler beim Setzen des Admins aufgetreten, bitte versuche es später erneut.',
      )
    }
  },

  removeUserAdmin: async (userId, groupId) => {
    try {
      const supabase = createClient()
      const { error } = await removeUserAdmin(supabase, userId, groupId)
      if (error) throw error
      set((state) => ({
        groupMembers: state.groupMembers.map((member) =>
          member.user_id === userId ? { ...member, role: 'member' } : member,
        ),
      }))
      showNotification(
        'Admin entfernt',
        'Der Benutzer wurde erfolgreich als Admin entzogen.',
        'success',
      )
    } catch (error) {
      handleError(
        error,
        'Fehler beim Entfernen des Admins',
        'Es ist ein Fehler beim Entfernen des Admins aufgetreten, bitte versuche es später erneut.',
      )
    }
  },
}))
