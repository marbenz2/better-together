export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      group_members: {
        Row: {
          favourite: boolean | null
          group_id: string
          id: string
          joined_at: string
          role: "admin" | "member"
          user_id: string
        }
        Insert: {
          favourite?: boolean | null
          group_id: string
          id?: string
          joined_at?: string
          role?: "admin" | "member"
          user_id: string
        }
        Update: {
          favourite?: boolean | null
          group_id?: string
          id?: string
          joined_at?: string
          role?: "admin" | "member"
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birthday: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          profile_picture: string | null
        }
        Insert: {
          birthday: string
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          profile_picture?: string | null
        }
        Update: {
          birthday?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          profile_picture?: string | null
        }
        Relationships: []
      }
      trip_members: {
        Row: {
          additional: string[] | null
          created_at: string
          down_payment: boolean
          down_payment_amount: number | null
          final_payment: boolean
          final_payment_amount: number | null
          full_payment: boolean
          full_payment_amount: number | null
          id: string
          role: Database["public"]["Enums"]["enum_trip_members_role"]
          subscribed_at: string
          trip_id: string
          user_id: string
        }
        Insert: {
          additional?: string[] | null
          created_at?: string
          down_payment?: boolean
          down_payment_amount?: number | null
          final_payment?: boolean
          final_payment_amount?: number | null
          full_payment?: boolean
          full_payment_amount?: number | null
          id?: string
          role?: Database["public"]["Enums"]["enum_trip_members_role"]
          subscribed_at?: string
          trip_id: string
          user_id: string
        }
        Update: {
          additional?: string[] | null
          created_at?: string
          down_payment?: boolean
          down_payment_amount?: number | null
          final_payment?: boolean
          final_payment_amount?: number | null
          full_payment?: boolean
          full_payment_amount?: number | null
          id?: string
          role?: Database["public"]["Enums"]["enum_trip_members_role"]
          subscribed_at?: string
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_members_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          anreise_link: string
          area: string | null
          available_spots: number
          beds: number
          created_by: string
          date_from: string
          date_to: string
          group_id: string
          iban: string | null
          id: string
          image: string
          initial_down_payment: number | null
          land: string
          location_name: string
          max_spots: number
          name: string
          ort: string
          paypal: string | null
          plz: string
          price_per_night: number | null
          recipient: string | null
          rooms: number
          status: "upcoming" | "current" | "done"
          street: string
          street_number: number
        }
        Insert: {
          anreise_link: string
          area?: string | null
          available_spots: number
          beds: number
          created_by: string
          date_from: string
          date_to: string
          group_id: string
          iban?: string | null
          id?: string
          image: string
          initial_down_payment?: number | null
          land: string
          location_name: string
          max_spots: number
          name: string
          ort: string
          paypal?: string | null
          plz: string
          price_per_night?: number | null
          recipient?: string | null
          rooms: number
          status?: "upcoming" | "current" | "done"
          street: string
          street_number: number
        }
        Update: {
          anreise_link?: string
          area?: string | null
          available_spots?: number
          beds?: number
          created_by?: string
          date_from?: string
          date_to?: string
          group_id?: string
          iban?: string | null
          id?: string
          image?: string
          initial_down_payment?: number | null
          land?: string
          location_name?: string
          max_spots?: number
          name?: string
          ort?: string
          paypal?: string | null
          plz?: string
          price_per_night?: number | null
          recipient?: string | null
          rooms?: number
          status?: "upcoming" | "current" | "done"
          street?: string
          street_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "trips_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_trigger_context: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      enum_group_members_role: "admin" | "member"
      enum_trip_members_role: "admin" | "member"
      enum_trips_status: "upcoming" | "current" | "done"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
