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
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_members: {
        Row: {
          created_at: string
          down_payment: boolean | null
          down_payment_paypal_id: string | null
          final_payment: boolean | null
          final_payment_paypal_id: string | null
          full_payment: boolean | null
          full_payment_paypal_id: string | null
          id: string
          role: Database["public"]["Enums"]["enum_trip_members_role"]
          subscribed_at: string
          trip_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          down_payment?: boolean | null
          down_payment_paypal_id?: string | null
          final_payment?: boolean | null
          final_payment_paypal_id?: string | null
          full_payment?: boolean | null
          full_payment_paypal_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["enum_trip_members_role"]
          subscribed_at?: string
          trip_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          down_payment?: boolean | null
          down_payment_paypal_id?: string | null
          final_payment?: boolean | null
          final_payment_paypal_id?: string | null
          full_payment?: boolean | null
          full_payment_paypal_id?: string | null
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
          {
            foreignKeyName: "trip_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          anreise_link: string
          area: string | null
          beds: number
          created_by: string
          date_from: string
          date_to: string
          down_payment: number | null
          final_payment: number | null
          full_payment: number | null
          group_id: string
          id: string
          image: string
          land: string
          name: string
          ort: string
          plz: string
          rooms: number
          status: "upcoming" | "current" | "done"
          street: string
          street_number: number
        }
        Insert: {
          anreise_link: string
          area?: string | null
          beds: number
          created_by: string
          date_from: string
          date_to: string
          down_payment?: number | null
          final_payment?: number | null
          full_payment?: number | null
          group_id: string
          id?: string
          image: string
          land: string
          name: string
          ort: string
          plz: string
          rooms: number
          status?: "upcoming" | "current" | "done"
          street: string
          street_number: number
        }
        Update: {
          anreise_link?: string
          area?: string | null
          beds?: number
          created_by?: string
          date_from?: string
          date_to?: string
          down_payment?: number | null
          final_payment?: number | null
          full_payment?: number | null
          group_id?: string
          id?: string
          image?: string
          land?: string
          name?: string
          ort?: string
          plz?: string
          rooms?: number
          status?: "upcoming" | "current" | "done"
          street?: string
          street_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "trips_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
      set_current_user_id: {
        Args: {
          user_id: string
        }
        Returns: undefined
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
