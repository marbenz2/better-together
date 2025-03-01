import { PostgrestError, SupabaseClient, User } from "@supabase/supabase-js";
import { cache } from "react";
import { GroupMembers, Groups, TripMembers, Trips } from "@/types/supabase";
import { PublicProfilesType, UserGroupsType } from "@/types/dashboard";
import { PublicProfileType } from "@/types/user";
import {
  AdditionalMembersType,
  AvailableSpotsType,
  GroupTripType,
} from "@/types/trips";
import { createClient } from "./client";
import { UserPaymentsType } from "@/types/payment";

type GetUserResult = {
  data: User | null;
  error: PostgrestError | null;
};

export const getUser = cache(
  async (supabase: SupabaseClient): Promise<GetUserResult> => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { data: user, error: error as PostgrestError | null };
  }
);

type GetUserGroupsResult = {
  data: UserGroupsType[] | null;
  error: PostgrestError | null;
};

export const getUserGroups = cache(
  async (
    supabase: SupabaseClient,
    userId: string
  ): Promise<GetUserGroupsResult> => {
    const { data, error } = await supabase
      .from("group_members")
      .select("group_id, favourite, role, groups(*)")
      .eq("user_id", userId)
      .returns<UserGroupsType[]>();
    return { data, error };
  }
);

type GetGroupMembersResult = {
  data: Pick<GroupMembers, "user_id" | "role">[] | null;
  error: PostgrestError | null;
};

export const getGroupMembers = cache(
  async (
    supabase: SupabaseClient,
    groupId: string
  ): Promise<GetGroupMembersResult> => {
    const { data, error } = await supabase
      .from("group_members")
      .select("user_id, role")
      .eq("group_id", groupId)
      .returns<Pick<GroupMembers, "user_id" | "role">[]>();
    return { data, error };
  }
);

type RemoveUserFromGroupResult = {
  data: Pick<GroupMembers, "group_id" | "favourite" | "role">[] | null;
  error: PostgrestError | null;
};

export const removeUserFromGroup = cache(
  async (
    supabase: SupabaseClient,
    userId: string,
    groupId: string
  ): Promise<RemoveUserFromGroupResult> => {
    const { data, error } = await supabase
      .from("group_members")
      .delete()
      .eq("user_id", userId)
      .eq("group_id", groupId)
      .returns<GroupMembers[]>();
    return { data, error };
  }
);

type MakeUserAdminResult = {
  data: GroupMembers | null;
  error: PostgrestError | null;
};

export const makeUserAdmin = cache(
  async (
    supabase: SupabaseClient,
    userId: string,
    groupId: string
  ): Promise<MakeUserAdminResult> => {
    const { data, error } = await supabase
      .from("group_members")
      .update({ role: "admin" })
      .eq("user_id", userId)
      .eq("group_id", groupId)
      .returns<GroupMembers>();
    return { data, error };
  }
);

type RemoveUserAdminResult = {
  data: Pick<GroupMembers, "group_id" | "favourite" | "role">[] | null;
  error: PostgrestError | null;
};

export const removeUserAdmin = cache(
  async (
    supabase: SupabaseClient,
    userId: string,
    groupId: string
  ): Promise<RemoveUserAdminResult> => {
    const { data, error } = await supabase
      .from("group_members")
      .update({ role: "member" })
      .eq("user_id", userId)
      .eq("group_id", groupId)
      .returns<GroupMembers[]>();
    return { data, error };
  }
);

type GetPublicProfilesResult = {
  data: PublicProfilesType[] | null;
  error: PostgrestError | null;
};

export const getPublicProfiles = cache(
  async (
    supabase: SupabaseClient,
    userIds: string[]
  ): Promise<GetPublicProfilesResult> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds)
      .returns<PublicProfilesType[]>();
    return { data, error };
  }
);

type PublicProfileResult = {
  data: PublicProfileType | null;
  error: PostgrestError | null;
};

export const getPublicProfile = cache(
  async (
    supabase: SupabaseClient,
    userId: string
  ): Promise<PublicProfileResult> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .returns<PublicProfileType>()
      .maybeSingle();
    return { data, error };
  }
);

type UpdatePublicProfileResult = {
  data: PublicProfileType | null;
  error: PostgrestError | null;
};

export const updatePublicProfile = cache(
  async (
    supabase: SupabaseClient,
    profile: PublicProfileType
  ): Promise<UpdatePublicProfileResult> => {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        birthday: profile.birthday,
        profile_picture: profile.profile_picture,
      })
      .eq("id", profile.id)
      .select()
      .returns<PublicProfileType>()
      .single();
    return { data, error };
  }
);

type GetTripResult = {
  data: Trips | null;
  error: PostgrestError | null;
};

export const getTrip = cache(
  async (supabase: SupabaseClient, tripId: string): Promise<GetTripResult> => {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", tripId)
      .returns<Trips[]>()
      .single();
    return { data, error };
  }
);

type GetGroupTripsResult = {
  data: Trips[] | null;
  error: PostgrestError | null;
};

export const getGroupTrips = cache(
  async (
    supabase: SupabaseClient,
    groupId: string
  ): Promise<GetGroupTripsResult> => {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("group_id", groupId)
      .returns<Trips[]>();
    return { data, error };
  }
);

type GetSubscribedTripsResult = {
  data:
    | ({ trips: Trips } & { subscribed_at: TripMembers["subscribed_at"] })[]
    | null;
  error: PostgrestError | null;
};

export const getSubscribedTrips = cache(
  async (
    supabase: SupabaseClient,
    userId: string
  ): Promise<GetSubscribedTripsResult> => {
    const { data, error } = await supabase
      .from("trip_members")
      .select("trips(*), subscribed_at")
      .eq("user_id", userId)
      .returns<
        ({ trips: Trips } & { subscribed_at: TripMembers["subscribed_at"] })[]
      >();
    return { data, error };
  }
);

type CreateGroupResult = {
  data: Groups | null;
  error: PostgrestError | null;
};

export const createGroup = cache(
  async (
    supabase: SupabaseClient,
    userId: string,
    groupName: string
  ): Promise<CreateGroupResult> => {
    const { data, error } = await supabase
      .from("groups")
      .insert([{ name: groupName, created_by: userId }])
      .select()
      .returns<Groups[]>()
      .single();

    if (data) {
      await supabase.from("group_members").insert([
        {
          user_id: userId,
          group_id: data.id,
          favourite: true,
          role: "admin",
        },
      ]);
    }
    return { data, error };
  }
);

type DeleteGroupResult = {
  data: Groups[] | null;
  error: PostgrestError | null;
};

export const deleteGroup = cache(
  async (
    supabase: SupabaseClient,
    userId: string,
    groupId: string
  ): Promise<DeleteGroupResult> => {
    const { data, error } = await supabase
      .from("groups")
      .delete()
      .eq("id", groupId)
      .eq("created_by", userId)
      .returns<Groups[]>();
    return { data, error };
  }
);

type LeaveGroupResult = {
  data: GroupMembers[] | null;
  error: PostgrestError | null;
};

export const leaveGroup = cache(
  async (
    supabase: SupabaseClient,
    userId: string,
    groupId: string
  ): Promise<LeaveGroupResult> => {
    const { data, error } = await supabase
      .from("group_members")
      .delete()
      .eq("user_id", userId)
      .eq("group_id", groupId)
      .returns<GroupMembers[]>();
    return { data, error };
  }
);

type RenameGroupResult = {
  data: Groups[] | null;
  error: PostgrestError | null;
};

export const renameGroup = cache(
  async (
    supabase: SupabaseClient,
    userId: string,
    groupId: string,
    newName: string
  ): Promise<RenameGroupResult> => {
    const { data, error } = await supabase
      .from("groups")
      .update({ name: newName })
      .eq("id", groupId)
      .eq("created_by", userId)
      .select()
      .returns<Groups[]>();
    return { data, error };
  }
);

type JoinGroupResult = {
  data: Groups | null;
  error: PostgrestError | null;
};

export const joinGroup = cache(
  async (
    supabase: SupabaseClient,
    userId: string,
    groupId: string
  ): Promise<JoinGroupResult> => {
    const { error: insertError } = await supabase.from("group_members").insert([
      {
        user_id: userId,
        group_id: groupId,
        favourite: false,
        role: "member",
      },
    ]);
    if (insertError) return { data: null, error: insertError };

    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .returns<Groups[]>()
      .maybeSingle();

    return { data, error };
  }
);

type SetFavouriteGroupResult = {
  data: GroupMembers[] | null;
  error: PostgrestError | null;
};

export const setFavouriteGroup = cache(
  async (
    supabase: SupabaseClient,
    userId: string,
    groupId: string,
    newFavourite: boolean
  ): Promise<SetFavouriteGroupResult> => {
    const { data, error } = await supabase
      .from("group_members")
      .update({ favourite: newFavourite })
      .eq("user_id", userId)
      .eq("group_id", groupId)
      .select()
      .returns<GroupMembers[]>();
    return { data, error };
  }
);

type AddSubscriptionResult = {
  data: TripMembers | null;
  error: PostgrestError | null;
};

export const addSubscription = cache(
  async (
    tripId: string,
    userId: string,
    additionalMembers: AdditionalMembersType
  ): Promise<AddSubscriptionResult> => {
    const supabase = createClient();
    const { data: existingSubscription, error: fetchError } = await supabase
      .from("trip_members")
      .select("id")
      .eq("user_id", userId)
      .eq("trip_id", tripId)
      .maybeSingle();

    if (fetchError) return { data: null, error: fetchError };
    if (existingSubscription)
      return {
        data: null,
        error: {
          message: "Benutzer ist bereits für diese Reise angemeldet",
        } as PostgrestError,
      };

    const { data, error } = await supabase
      .from("trip_members")
      .insert({
        user_id: userId,
        trip_id: tripId,
        role: "member",
        additional: additionalMembers,
        subscribed_at: new Date().toISOString(),
      })
      .select()
      .returns<TripMembers>()
      .single();

    return { data, error };
  }
);

type RemoveSubscriptionResult = {
  data: TripMembers[] | null;
  error: PostgrestError | null;
};

export const removeSubscription = cache(
  async (tripId: string, userId: string): Promise<RemoveSubscriptionResult> => {
    const supabase = createClient();
    const { data: subscription, error: fetchError } = await supabase
      .from("trip_members")
      .select("down_payment, full_payment, final_payment")
      .eq("user_id", userId)
      .eq("trip_id", tripId)
      .returns<TripMembers[]>()
      .single();

    if (fetchError) return { data: null, error: fetchError };
    if (
      subscription.down_payment ||
      subscription.full_payment ||
      subscription.final_payment
    ) {
      return {
        data: null,
        error: {
          message: "Abmeldung nach erfolgter Zahlung nicht möglich",
        } as PostgrestError,
      };
    }

    const { data, error } = await supabase
      .from("trip_members")
      .delete()
      .eq("user_id", userId)
      .eq("trip_id", tripId)
      .select()
      .returns<TripMembers[]>();

    return { data, error };
  }
);

type SetTripStatusResult = {
  data: Trips | null;
  error: PostgrestError | null;
};

export const setTripStatus = cache(
  async (
    tripId: string,
    userId: string,
    status: "upcoming" | "current" | "done"
  ): Promise<SetTripStatusResult> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("trips")
      .update({ status })
      .eq("id", tripId)
      .eq("created_by", userId)
      .select()
      .returns<Trips[]>()
      .single();
    return { data, error };
  }
);

type CreateTripResult = {
  data: Trips | null;
  error: PostgrestError | null;
};

export const createTrip = cache(
  async (
    supabase: SupabaseClient,
    trip: GroupTripType
  ): Promise<CreateTripResult> => {
    const { data, error } = await supabase
      .from("trips")
      .insert(trip)
      .select()
      .returns<Trips>()
      .single();
    return { data, error };
  }
);

type UpdateTripResult = {
  data: Trips | null;
  error: PostgrestError | null;
};

export const updateTrip = cache(
  async (
    supabase: SupabaseClient,
    trip: GroupTripType
  ): Promise<UpdateTripResult> => {
    const { data, error } = await supabase
      .from("trips")
      .update(trip)
      .eq("id", trip.id)
      .select()
      .returns<Trips>()
      .single();
    return { data, error };
  }
);

type DeleteTripResult = {
  data: Trips | null;
  error: PostgrestError | null;
};

export const deleteTrip = cache(
  async (
    supabase: SupabaseClient,
    tripId: string
  ): Promise<DeleteTripResult> => {
    const { data, error } = await supabase
      .from("trips")
      .delete()
      .eq("id", tripId)
      .select()
      .returns<Trips>()
      .single();
    return { data, error };
  }
);

type GetTripMembersResult = {
  data: TripMembers[] | null;
  error: PostgrestError | null;
};

export const getTripMembers = cache(
  async (
    supabase: SupabaseClient,
    tripId: string
  ): Promise<GetTripMembersResult> => {
    const { data, error } = await supabase
      .from("trip_members")
      .select("*")
      .eq("trip_id", tripId)
      .returns<TripMembers[]>();
    return { data, error };
  }
);

type AddAdditionalMembersResult = {
  data: TripMembers | null;
  error: PostgrestError | null;
};

export const addAdditionalMembers = cache(
  async (
    tripId: string,
    userId: string,
    additionalMembers: AdditionalMembersType
  ): Promise<AddAdditionalMembersResult> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("trip_members")
      .update({ additional: additionalMembers })
      .eq("trip_id", tripId)
      .eq("user_id", userId)
      .select()
      .returns<TripMembers>()
      .single();
    return { data, error };
  }
);

type GetAdditionalMembersResult = {
  data: AdditionalMembersType;
  error: PostgrestError | null;
};

export const getAdditionalMembers = cache(
  async (
    supabase: SupabaseClient,
    tripId: string,
    userId: string
  ): Promise<GetAdditionalMembersResult> => {
    const { data, error } = await supabase
      .from("trip_members")
      .select("additional")
      .eq("trip_id", tripId)
      .eq("user_id", userId)
      .returns<AdditionalMembersType>();
    return { data, error };
  }
);

type GetAvailableSpotsResult = {
  data: AvailableSpotsType;
  error: PostgrestError | null;
};

export const getAvailableSpots = cache(
  async (
    supabase: SupabaseClient,
    tripId: string
  ): Promise<GetAvailableSpotsResult> => {
    const { data, error } = await supabase
      .from("trips")
      .select("available_spots")
      .eq("id", tripId)
      .single();
    const availableSpots = data ? data.available_spots : null;
    return { data: availableSpots, error };
  }
);

type SetUserPaymentsResult = {
  data: TripMembers[] | null;
  error: PostgrestError | null;
};

export const setUserPayments = cache(
  async (
    supabase: SupabaseClient,
    payments: {
      userId: string;
      tripId: string;
      down_payment_amount?: number | null;
      full_payment_amount?: number | null;
      final_payment_amount?: number | null;
      down_payment: boolean;
      full_payment: boolean;
      final_payment: boolean;
    }[]
  ): Promise<SetUserPaymentsResult> => {
    const results = await Promise.all(
      payments.map(async ({ userId, tripId, ...paymentData }) => {
        const { data, error } = await supabase
          .from("trip_members")
          .update(paymentData)
          .eq("trip_id", tripId)
          .eq("user_id", userId)
          .select()
          .single();
        return { data, error };
      })
    );

    const successfulUpdates = results
      .filter((result) => !result.error)
      .map((result) => result.data);
    const errors = results
      .filter((result) => result.error)
      .map((result) => result.error);

    return {
      data: successfulUpdates.length > 0 ? successfulUpdates : null,
      error: errors.length > 0 ? errors[0] : null,
    };
  }
);

type GetUserPaymentsResult = {
  data: UserPaymentsType[] | null;
  error: PostgrestError | null;
};

export const getUserPayments = cache(
  async (
    supabase: SupabaseClient,
    userId: string
  ): Promise<GetUserPaymentsResult> => {
    const { data, error } = await supabase
      .from("trip_members")
      .select(
        "trip_id, down_payment_amount, full_payment_amount, final_payment_amount,down_payment, full_payment, final_payment, created_at"
      )
      .eq("user_id", userId)
      .returns<UserPaymentsType[]>();
    return { data, error };
  }
);

type UpdatePaymentStatusResult = {
  data: TripMembers | null;
  error: PostgrestError | null;
};

export const updatePaymentStatus = cache(
  async (
    userId: string,
    tripId: string,
    paymentType: "down_payment" | "full_payment" | "final_payment",
    transactionId: string
  ): Promise<UpdatePaymentStatusResult> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("trip_members")
      .update({
        [paymentType]: true,
        [`${paymentType}_paypal_id`]: transactionId,
      })
      .eq("user_id", userId)
      .eq("trip_id", tripId)
      .select()
      .single();

    return { data, error };
  }
);
