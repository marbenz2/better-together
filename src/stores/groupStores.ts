import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";
import type {
  GroupMembersType,
  PublicProfilesType,
  UserGroupsType,
} from "@/types/dashboard";
import {
  createGroup,
  joinGroup,
  setFavouriteGroup,
  deleteGroup,
  renameGroup,
  leaveGroup,
  getGroupMembers,
  getPublicProfiles,
  getUserGroups,
  removeUserFromGroup,
  makeUserAdmin,
  removeUserAdmin,
} from "@/utils/supabase/queries";
import { NotificationMessage } from "@/types/notification";
import { showNotification } from "@/lib/utils";
import { useUserStore } from "./userStore";

interface GroupState {
  userGroups: UserGroupsType[];
  groupId: string | null;
  selectedGroupName: string | null;
  groupMembers: GroupMembersType[];
  publicProfiles: PublicProfilesType[];
  tripPublicProfiles: PublicProfilesType[];
  groupPublicProfiles: PublicProfilesType[];
  setUserGroups: (userGroups: UserGroupsType[]) => void;
  setGroupId: (groupId: string | null) => void;
  setSelectedGroupName: (name: string | null) => void;
  setGroupPublicProfiles: (groupPublicProfiles: PublicProfilesType[]) => void;
  handleOnValueChange: (value: string) => void;
  createGroup: (groupName: string, userId: string) => Promise<void>;
  joinGroup: (inviteCode: string, userId: string) => Promise<void>;
  leaveGroup: (groupIdToLeave: string, userId: string) => Promise<void>;
  deleteGroup: (groupIdToDelete: string, userId: string) => Promise<void>;
  renameGroup: (
    groupIdToRename: string,
    newName: string,
    userId: string
  ) => Promise<void>;
  setFavourite: (
    groupIdToFavourite: string,
    isFavourite: boolean,
    userId: string
  ) => Promise<void>;
  getAllGroupMembers: (groupId: string) => Promise<void>;
  getAllPublicProfiles: (user_ids: string[]) => Promise<void>;
  getAllTripPublicProfiles: (user_ids: string[]) => Promise<void>;
  getAllGroupPublicProfiles: (user_ids: string[]) => Promise<void>;
  getAllUserGroups: (userId: string) => Promise<void>;
  removeUserFromGroup: (userId: string, groupId: string) => Promise<void>;
  makeUserAdmin: (userId: string, groupId: string) => Promise<void>;
  removeUserAdmin: (userId: string, groupId: string) => Promise<void>;
}

const handleError = (
  error: unknown,
  defaultTitle: string,
  defaultMessage?: string,
  context?: string
) => {
  const errorMessages: {
    [key: string]: { [context: string]: NotificationMessage };
  } = {
    "23505": {
      default: {
        title: "Fehler",
        variant: "destructive",
        message: "Ein Eintrag mit diesem Namen existiert bereits.",
      },
      createGroup: {
        title: "Fehler",
        variant: "destructive",
        message: "Eine Gruppe mit diesem Namen existiert bereits.",
      },
      renameGroup: {
        title: "Fehler",
        variant: "destructive",
        message: "Eine Gruppe mit diesem Namen existiert bereits.",
      },
      joinGroup: {
        title: "Fehler",
        variant: "destructive",
        message: "Du bist bereits Mitglied dieser Gruppe.",
      },
    },
    "22P02": {
      default: {
        title: "Fehler",
        variant: "destructive",
        message: "Das war kein korrektes Format eines Einladungslinks.",
      },
    },
    "23503": {
      default: {
        title: "Fehler",
        variant: "destructive",
        message: "Falscher Einladungslink.",
      },
    },
  };

  const errorCode = (error as { code?: string })?.code || "unknown";
  const errorContext = context || "default";
  const errorMessage = errorMessages[errorCode]?.[errorContext] ||
    errorMessages[errorCode]?.default || {
      title: defaultTitle,
      variant: "destructive",
      message: defaultMessage,
    };

  showNotification(
    errorMessage.title,
    errorMessage.variant,
    errorMessage.message
  );
};

export const useGroupStore = create<GroupState>((set, get) => {
  const supabase = createClient();
  return {
    userGroups: [] as UserGroupsType[],
    groupId: null as string | null,
    selectedGroupName: null as string | null,
    groupMembers: [] as GroupMembersType[],
    publicProfiles: [] as PublicProfilesType[],
    tripPublicProfiles: [] as PublicProfilesType[],
    groupPublicProfiles: [] as PublicProfilesType[],

    setGroupId: (groupId) => set({ groupId }),
    setSelectedGroupName: (name) => set({ selectedGroupName: name }),
    setUserGroups: (userGroups) => set({ userGroups }),
    setGroupPublicProfiles: (groupPublicProfiles) =>
      set({ groupPublicProfiles: groupPublicProfiles }),

    handleOnValueChange: (value) => {
      const { userGroups } = get();
      const selectedGroup = userGroups?.find(
        (group) => group.groups.name === value
      );
      if (selectedGroup) {
        set({
          groupId: selectedGroup.group_id,
          selectedGroupName: value,
        });
      }
    },

    createGroup: async (groupName, userId) => {
      try {
        const { data: group, error } = await createGroup(
          supabase,
          userId,
          groupName
        );
        if (error) throw error;

        if (group) {
          set((state) => ({
            userGroups: [
              ...state.userGroups,
              {
                group_id: group.id,
                favourite: true,
                role: "admin",
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
          }));
          showNotification("Gruppe erstellt", "success");
        }
      } catch (error) {
        handleError(error, "Fehler beim Erstellen der Gruppe", "createGroup");
      }
    },

    joinGroup: async (inviteCode, userId) => {
      try {
        const { data: group, error } = await joinGroup(
          supabase,
          userId,
          inviteCode
        );
        if (error) throw error;
        if (group) {
          set((state) => ({
            userGroups: [
              ...state.userGroups,
              {
                group_id: group.id,
                favourite: false,
                role: "member",
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
          }));
          showNotification("Gruppe beigetreten", "success");
        }
      } catch (error) {
        handleError(
          error,
          "Fehler beim Beitreten der Gruppe",
          "Es ist ein Fehler beim Beitreten der Gruppe aufgetreten, bitte versuche es später erneut.",
          "joinGroup"
        );
      }
    },

    leaveGroup: async (groupIdToLeave, userId) => {
      try {
        const { error } = await leaveGroup(supabase, userId, groupIdToLeave);
        if (error) throw error;

        set((state) => ({
          userGroups: state.userGroups.filter(
            (group) => group.group_id !== groupIdToLeave
          ),
          groupId: state.groupId === groupIdToLeave ? null : state.groupId,
          selectedGroupName:
            state.selectedGroupName === groupIdToLeave
              ? null
              : state.selectedGroupName,
          groupMembers: [],
        }));

        await useUserStore.getState().getSubscribedTrips();

        showNotification("Gruppe verlassen", "success");
      } catch (error) {
        handleError(
          error,
          "Fehler beim Verlassen der Gruppe",
          "Es ist ein Fehler beim Verlassen der Gruppe aufgetreten, bitte versuche es später erneut."
        );
      }
    },

    deleteGroup: async (groupIdToDelete, userId) => {
      try {
        const { error } = await deleteGroup(supabase, userId, groupIdToDelete);
        if (error) throw error;

        set((state) => {
          const updatedGroups = state.userGroups.filter(
            (group) => group.group_id !== groupIdToDelete
          );
          let newGroupId = state.groupId;
          let newSelectedGroupName = state.selectedGroupName;

          if (updatedGroups.length > 0) {
            const nextGroup =
              updatedGroups.find((group) => group.favourite) ||
              updatedGroups[0];
            newGroupId = nextGroup.group_id;
            newSelectedGroupName = nextGroup.groups.name;
            showNotification("Gruppe gelöscht", "success");
          } else {
            newGroupId = null;
            newSelectedGroupName = null;
            showNotification(
              "Die letzte Gruppe wurde gelöscht. Sie sind jetzt in keiner Gruppe mehr.",
              "success"
            );
          }

          return {
            userGroups: updatedGroups,
            groupId: newGroupId,
            selectedGroupName: newSelectedGroupName,
            groupMembers: [],
          };
        });
      } catch (error) {
        handleError(
          error,
          "Fehler beim Löschen der Gruppe",
          "Es ist ein Fehler beim Löschen der Gruppe aufgetreten, bitte versuche es später erneut."
        );
      }
    },

    renameGroup: async (groupIdToRename, newName, userId) => {
      try {
        const { error } = await renameGroup(
          supabase,
          userId,
          groupIdToRename,
          newName
        );
        if (error) throw error;
        set((state) => ({
          userGroups: state.userGroups.map((group) =>
            group.group_id === groupIdToRename
              ? { ...group, groups: { ...group.groups, name: newName } }
              : group
          ),
          selectedGroupName: newName,
        }));
        showNotification("Gruppe umbenannt", "success");
      } catch (error) {
        handleError(
          error,
          "Fehler beim Umbennen der Gruppe",
          "Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut."
        );
      }
    },

    setFavourite: async (groupIdToFavourite, isFavourite, userId) => {
      try {
        const { error } = await setFavouriteGroup(
          supabase,
          userId,
          groupIdToFavourite,
          isFavourite
        );
        if (error) throw error;

        set((state) => ({
          userGroups: state.userGroups.map((group) =>
            group.group_id === groupIdToFavourite
              ? { ...group, favourite: isFavourite }
              : group
          ),
        }));

        showNotification("Favoriten gesetzt", "success");
      } catch (error) {
        handleError(
          error,
          "Fehler beim Setzen der Favoriten",
          "Es ist ein Fehler beim Setzen der Favoriten aufgetreten, bitte versuche es später erneut."
        );
      }
    },

    getAllGroupMembers: async (groupId) => {
      try {
        const { data, error } = await getGroupMembers(supabase, groupId);
        if (error) throw error;
        set({ groupMembers: data ?? [] });
      } catch (error) {
        handleError(
          error,
          "Fehler beim Laden der Gruppenmitglieder",
          "Es ist ein Fehler beim Laden der Gruppenmitglieder aufgetreten, bitte versuche es später erneut."
        );
        set({ groupMembers: [] });
      }
    },

    getAllPublicProfiles: async (user_ids) => {
      try {
        const { data, error } = await getPublicProfiles(supabase, user_ids);
        if (error) throw error;
        set({ publicProfiles: data ?? [] });
      } catch (error) {
        handleError(
          error,
          "Fehler beim Laden der öffentlichen Profile",
          "Es ist ein Fehler beim Laden der öffentlichen Profile aufgetreten, bitte versuche es später erneut."
        );
        set({ publicProfiles: [] });
      }
    },

    getAllTripPublicProfiles: async (user_ids) => {
      try {
        const { data, error } = await getPublicProfiles(supabase, user_ids);
        if (error) throw error;
        set({ tripPublicProfiles: data ?? [] });
      } catch (error) {
        handleError(
          error,
          "Fehler beim Laden der öffentlichen Profile",
          "Es ist ein Fehler beim Laden der öffentlichen Profile aufgetreten, bitte versuche es später erneut."
        );
        set({ tripPublicProfiles: [] });
      }
    },

    getAllGroupPublicProfiles: async (user_ids) => {
      try {
        const { data, error } = await getPublicProfiles(supabase, user_ids);
        if (error) throw error;
        set({ groupPublicProfiles: data ?? [] });
      } catch (error) {
        handleError(
          error,
          "Fehler beim Laden der öffentlichen Profile",
          "Es ist ein Fehler beim Laden der öffentlichen Profile aufgetreten, bitte versuche es später erneut."
        );
        set({ groupPublicProfiles: [] });
      }
    },

    getAllUserGroups: async (userId) => {
      try {
        const { data, error } = await getUserGroups(supabase, userId);
        if (error) throw error;
        set({ userGroups: data ?? [] });
      } catch (error) {
        handleError(
          error,
          "Fehler beim Laden der Gruppen",
          "Es ist ein Fehler beim Laden der Gruppen aufgetreten, bitte versuche es später erneut."
        );
        set({ userGroups: [] });
      }
    },

    removeUserFromGroup: async (userId, groupId) => {
      try {
        const { error } = await removeUserFromGroup(supabase, userId, groupId);
        if (error) throw error;

        set((state) => ({
          groupMembers: state.groupMembers.filter(
            (member) => member.user_id !== userId
          ),
        }));

        await get().getAllGroupMembers(groupId);

        if (userId === useUserStore.getState().user.id) {
          await useUserStore.getState().getSubscribedTrips();
        }

        showNotification("Benutzer entfernt", "success");
      } catch (error) {
        handleError(
          error,
          "Fehler beim Entfernen des Benutzers",
          "Es ist ein Fehler beim Entfernen des Benutzers aufgetreten, bitte versuche es später erneut."
        );
      }
    },

    makeUserAdmin: async (userId, groupId) => {
      try {
        const { error } = await makeUserAdmin(supabase, userId, groupId);
        if (error) throw error;
        set((state) => ({
          groupMembers: state.groupMembers.map((member) =>
            member.user_id === userId ? { ...member, role: "admin" } : member
          ),
        }));
        showNotification("Admin-Rechte hinzugefügt", "success");
      } catch (error) {
        handleError(
          error,
          "Fehler beim Setzen des Admins",
          "Es ist ein Fehler beim Setzen des Admins aufgetreten, bitte versuche es später erneut."
        );
      }
    },

    removeUserAdmin: async (userId, groupId) => {
      try {
        const { error } = await removeUserAdmin(supabase, userId, groupId);
        if (error) throw error;
        set((state) => ({
          groupMembers: state.groupMembers.map((member) =>
            member.user_id === userId ? { ...member, role: "member" } : member
          ),
        }));
        showNotification("Admin-Rechte entfernt", "success");
      } catch (error) {
        handleError(
          error,
          "Fehler beim Entfernen der Admin-Rechte",
          "Es ist ein Fehler beim Entfernen der Admin-Rechte aufgetreten, bitte versuche es später erneut."
        );
      }
    },
  };
});
