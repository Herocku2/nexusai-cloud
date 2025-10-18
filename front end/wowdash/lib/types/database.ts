export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      academy_content: {
        Row: {
          category: string | null
          content_data: Json | null
          created_at: string | null
          description: string | null
          duration: number | null
          file_path: string | null
          file_size: number | null
          id: number
          is_active: boolean | null
          is_free: boolean | null
          mime_type: string | null
          order_index: number | null
          required_rank_id: number | null
          slug: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string | null
          url: string | null
          uuid: string
        }
        Insert: {
          category?: string | null
          content_data?: Json | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          file_path?: string | null
          file_size?: number | null
          id?: never
          is_active?: boolean | null
          is_free?: boolean | null
          mime_type?: string | null
          order_index?: number | null
          required_rank_id?: number | null
          slug: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          type: string
          updated_at?: string | null
          url?: string | null
          uuid?: string
        }
        Update: {
          category?: string | null
          content_data?: Json | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          file_path?: string | null
          file_size?: number | null
          id?: never
          is_active?: boolean | null
          is_free?: boolean | null
          mime_type?: string | null
          order_index?: number | null
          required_rank_id?: number | null
          slug?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          url?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_content_required_rank_id_fkey"
            columns: ["required_rank_id"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
        ]
      }
      binary_positions: {
        Row: {
          created_at: string | null
          id: number
          left_carryover: number | null
          left_child_id: number | null
          left_volume: number | null
          level: number
          parent_id: number | null
          path: string | null
          position_leg: string
          right_carryover: number | null
          right_child_id: number | null
          right_volume: number | null
          sponsor_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          left_carryover?: number | null
          left_child_id?: number | null
          left_volume?: number | null
          level?: number
          parent_id?: number | null
          path?: string | null
          position_leg: string
          right_carryover?: number | null
          right_child_id?: number | null
          right_volume?: number | null
          sponsor_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          left_carryover?: number | null
          left_child_id?: number | null
          left_volume?: number | null
          level?: number
          parent_id?: number | null
          path?: string | null
          position_leg?: string
          right_carryover?: number | null
          right_child_id?: number | null
          right_volume?: number | null
          sponsor_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "binary_positions_left_child_id_fkey"
            columns: ["left_child_id"]
            isOneToOne: false
            referencedRelation: "binary_positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "binary_positions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "binary_positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "binary_positions_right_child_id_fkey"
            columns: ["right_child_id"]
            isOneToOne: false
            referencedRelation: "binary_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          amount: number
          base_amount: number | null
          capped_amount: number | null
          created_at: string | null
          cycle_date: string
          daily_cap: number | null
          id: number
          left_leg_volume: number | null
          level: number | null
          percentage: number | null
          right_leg_volume: number | null
          source_user_id: string | null
          transaction_id: number | null
          type: string
          updated_at: string | null
          user_id: string
          weaker_leg_volume: number | null
        }
        Insert: {
          amount: number
          base_amount?: number | null
          capped_amount?: number | null
          created_at?: string | null
          cycle_date: string
          daily_cap?: number | null
          id?: never
          left_leg_volume?: number | null
          level?: number | null
          percentage?: number | null
          right_leg_volume?: number | null
          source_user_id?: string | null
          transaction_id?: number | null
          type: string
          updated_at?: string | null
          user_id: string
          weaker_leg_volume?: number | null
        }
        Update: {
          amount?: number
          base_amount?: number | null
          capped_amount?: number | null
          created_at?: string | null
          cycle_date?: string
          daily_cap?: number | null
          id?: never
          left_leg_volume?: number | null
          level?: number | null
          percentage?: number | null
          right_leg_volume?: number | null
          source_user_id?: string | null
          transaction_id?: number | null
          type?: string
          updated_at?: string | null
          user_id?: string
          weaker_leg_volume?: number | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          expires_at: string | null
          id: number
          pv_value: number
          starts_at: string | null
          status: string | null
          transaction_id: number | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          expires_at?: string | null
          id?: never
          pv_value: number
          starts_at?: string | null
          status?: string | null
          transaction_id?: number | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          expires_at?: string | null
          id?: never
          pv_value?: number
          starts_at?: string | null
          status?: string | null
          transaction_id?: number | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          email_sent: boolean | null
          email_sent_at: string | null
          id: number
          is_read: boolean | null
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: never
          is_read?: boolean | null
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: never
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      ranks: {
        Row: {
          benefits: Json | null
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          max_daily_earnings: number | null
          min_direct_left: number
          min_direct_right: number
          min_pv_leg: number
          name: string
          order_index: number
          requirements: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          benefits?: Json | null
          created_at?: string | null
          description?: string | null
          id?: never
          is_active?: boolean | null
          max_daily_earnings?: number | null
          min_direct_left?: number
          min_direct_right?: number
          min_pv_leg?: number
          name: string
          order_index: number
          requirements?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          benefits?: Json | null
          created_at?: string | null
          description?: string | null
          id?: never
          is_active?: boolean | null
          max_daily_earnings?: number | null
          min_direct_left?: number
          min_direct_right?: number
          min_pv_leg?: number
          name?: string
          order_index?: number
          requirements?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          is_public: boolean | null
          key: string
          type: string | null
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          is_public?: boolean | null
          key: string
          type?: string | null
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
          is_public?: boolean | null
          key?: string
          type?: string | null
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          block_number: number | null
          blockchain_tx_hash: string | null
          confirmations: number | null
          created_at: string | null
          currency: string | null
          fee: number | null
          from_address: string | null
          id: number
          metadata: Json | null
          net_amount: number | null
          notes: string | null
          processed_at: string | null
          required_confirmations: number | null
          status: string | null
          subtype: string | null
          to_address: string | null
          type: string
          updated_at: string | null
          user_id: string
          uuid: string
        }
        Insert: {
          amount: number
          block_number?: number | null
          blockchain_tx_hash?: string | null
          confirmations?: number | null
          created_at?: string | null
          currency?: string | null
          fee?: number | null
          from_address?: string | null
          id?: never
          metadata?: Json | null
          net_amount?: number | null
          notes?: string | null
          processed_at?: string | null
          required_confirmations?: number | null
          status?: string | null
          subtype?: string | null
          to_address?: string | null
          type: string
          updated_at?: string | null
          user_id: string
          uuid?: string
        }
        Update: {
          amount?: number
          block_number?: number | null
          blockchain_tx_hash?: string | null
          confirmations?: number | null
          created_at?: string | null
          currency?: string | null
          fee?: number | null
          from_address?: string | null
          id?: never
          metadata?: Json | null
          net_amount?: number | null
          notes?: string | null
          processed_at?: string | null
          required_confirmations?: number | null
          status?: string | null
          subtype?: string | null
          to_address?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
          uuid?: string
        }
        Relationships: []
      }
      user_content_progress: {
        Row: {
          completed_at: string | null
          content_id: number
          created_at: string | null
          id: number
          last_position: number | null
          progress_percentage: number | null
          quiz_answers: Json | null
          quiz_attempts: number | null
          quiz_score: number | null
          status: string | null
          updated_at: string | null
          user_id: string
          watch_time: number | null
        }
        Insert: {
          completed_at?: string | null
          content_id: number
          created_at?: string | null
          id?: never
          last_position?: number | null
          progress_percentage?: number | null
          quiz_answers?: Json | null
          quiz_attempts?: number | null
          quiz_score?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          watch_time?: number | null
        }
        Update: {
          completed_at?: string | null
          content_id?: number
          created_at?: string | null
          id?: never
          last_position?: number | null
          progress_percentage?: number | null
          quiz_answers?: Json | null
          quiz_attempts?: number | null
          quiz_score?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          watch_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_content_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "academy_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          balance: number | null
          country_code: string | null
          created_at: string | null
          date_of_birth: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          sponsor_id: string | null
          status: string | null
          total_earnings: number | null
          total_pv: number | null
          updated_at: string | null
        }
        Insert: {
          balance?: number | null
          country_code?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          sponsor_id?: string | null
          status?: string | null
          total_earnings?: number | null
          total_pv?: number | null
          updated_at?: string | null
        }
        Update: {
          balance?: number | null
          country_code?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          sponsor_id?: string | null
          status?: string | null
          total_earnings?: number | null
          total_pv?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_ranks: {
        Row: {
          achieved_at: string
          created_at: string | null
          id: number
          rank_id: number
          total_earnings: number
          total_pv: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achieved_at?: string
          created_at?: string | null
          id?: never
          rank_id: number
          total_earnings?: number
          total_pv?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achieved_at?: string
          created_at?: string | null
          id?: never
          rank_id?: number
          total_earnings?: number
          total_pv?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_ranks_rank_id_fkey"
            columns: ["rank_id"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          blockchain_tx_hash: string | null
          created_at: string | null
          currency: string | null
          destination_address: string
          fee: number | null
          id: number
          net_amount: number | null
          network: string | null
          notes: string | null
          processed_at: string | null
          rejection_reason: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          uuid: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          blockchain_tx_hash?: string | null
          created_at?: string | null
          currency?: string | null
          destination_address: string
          fee?: number | null
          id?: never
          net_amount?: number | null
          network?: string | null
          notes?: string | null
          processed_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          uuid?: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          blockchain_tx_hash?: string | null
          created_at?: string | null
          currency?: string | null
          destination_address?: string
          fee?: number | null
          id?: never
          net_amount?: number | null
          network?: string | null
          notes?: string | null
          processed_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          uuid?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_binary_commission: {
        Args: { commission_date?: string; target_user_id: string }
        Returns: {
          capped_amount: number
          carry_over_left: number
          carry_over_right: number
          commission_amount: number
          daily_cap: number
          left_volume: number
          right_volume: number
          user_id: string
          weaker_leg_volume: number
        }[]
      }
      calculate_leg_volume: {
        Args: { leg: string; root_user_id: string }
        Returns: number
      }
      find_next_available_position: {
        Args: { preferred_leg?: string; sponsor_user_id: string }
        Returns: {
          available_leg: string
          level: number
          parent_position_id: number
          parent_user_id: string
        }[]
      }
      get_binary_downline: {
        Args: { max_depth?: number; root_user_id: string }
        Returns: {
          left_volume: number
          level: number
          parent_id: number
          path: string
          position_leg: string
          right_volume: number
          user_id: string
        }[]
      }
      get_direct_referrals_count: {
        Args: { target_user_id: string }
        Returns: {
          left_count: number
          right_count: number
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_binary_volumes: {
        Args: { affected_user_id: string; new_pv: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
