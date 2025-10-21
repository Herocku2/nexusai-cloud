// TypeScript types generated from Supabase schema
// This file provides type safety for all database operations

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          country: string | null
          sponsor_id: string | null
          balance: number
          total_earnings: number
          total_pv: number
          status: 'active' | 'inactive' | 'suspended'
          is_admin: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          country?: string | null
          sponsor_id?: string | null
          balance?: number
          total_earnings?: number
          total_pv?: number
          status?: 'active' | 'inactive' | 'suspended'
          is_admin?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          country?: string | null
          sponsor_id?: string | null
          balance?: number
          total_earnings?: number
          total_pv?: number
          status?: 'active' | 'inactive' | 'suspended'
          is_admin?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      binary_positions: {
        Row: {
          id: string
          user_id: string
          parent_id: string | null
          left_child_id: string | null
          right_child_id: string | null
          position: 'left' | 'right' | null
          depth: number
          left_volume: number
          right_volume: number
          left_carryover: number
          right_carryover: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          parent_id?: string | null
          left_child_id?: string | null
          right_child_id?: string | null
          position?: 'left' | 'right' | null
          depth?: number
          left_volume?: number
          right_volume?: number
          left_carryover?: number
          right_carryover?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          parent_id?: string | null
          left_child_id?: string | null
          right_child_id?: string | null
          position?: 'left' | 'right' | null
          depth?: number
          left_volume?: number
          right_volume?: number
          left_carryover?: number
          right_carryover?: number
          created_at?: string
          updated_at?: string
        }
      }
      ranks: {
        Row: {
          id: string
          name: string
          level: number
          required_direct_referrals: number
          required_left_pv: number
          required_right_pv: number
          required_total_pv: number
          matching_bonus_percentage: number
          matching_bonus_levels: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          level: number
          required_direct_referrals?: number
          required_left_pv?: number
          required_right_pv?: number
          required_total_pv?: number
          matching_bonus_percentage?: number
          matching_bonus_levels?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          level?: number
          required_direct_referrals?: number
          required_left_pv?: number
          required_right_pv?: number
          required_total_pv?: number
          matching_bonus_percentage?: number
          matching_bonus_levels?: number
          created_at?: string
        }
      }
      user_ranks: {
        Row: {
          id: string
          user_id: string
          rank_id: string
          achieved_at: string
          is_current: boolean
        }
        Insert: {
          id?: string
          user_id: string
          rank_id: string
          achieved_at?: string
          is_current?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          rank_id?: string
          achieved_at?: string
          is_current?: boolean
        }
      }
      memberships: {
        Row: {
          id: string
          user_id: string
          type: 'initial' | 'monthly'
          amount: number
          started_at: string
          expires_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'initial' | 'monthly'
          amount: number
          started_at?: string
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'initial' | 'monthly'
          amount?: number
          started_at?: string
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'deposit' | 'withdrawal' | 'commission' | 'fee' | 'membership'
          amount: number
          notes: string | null
          tx_hash: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'deposit' | 'withdrawal' | 'commission' | 'fee' | 'membership'
          amount: number
          notes?: string | null
          tx_hash?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'deposit' | 'withdrawal' | 'commission' | 'fee' | 'membership'
          amount?: number
          notes?: string | null
          tx_hash?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      commissions: {
        Row: {
          id: string
          user_id: string
          from_user_id: string
          type: 'fast_start' | 'binary' | 'matching'
          amount: number
          level: number
          calculation_date: string
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          from_user_id: string
          type: 'fast_start' | 'binary' | 'matching'
          amount: number
          level?: number
          calculation_date?: string
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          from_user_id?: string
          type?: 'fast_start' | 'binary' | 'matching'
          amount?: number
          level?: number
          calculation_date?: string
          paid_at?: string | null
          created_at?: string
        }
      }
      academy_content: {
        Row: {
          id: string
          title: string
          description: string | null
          slug: string
          video_url: string | null
          duration: number
          category: string
          is_premium: boolean
          is_public: boolean
          is_active: boolean
          order_index: number
          thumbnail_url: string | null
          content_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          slug: string
          video_url?: string | null
          duration?: number
          category?: string
          is_premium?: boolean
          is_public?: boolean
          is_active?: boolean
          order_index?: number
          thumbnail_url?: string | null
          content_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          slug?: string
          video_url?: string | null
          duration?: number
          category?: string
          is_premium?: boolean
          is_public?: boolean
          is_active?: boolean
          order_index?: number
          thumbnail_url?: string | null
          content_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      user_content_progress: {
        Row: {
          id: string
          user_id: string
          content_id: string
          progress_percentage: number
          status: 'not_started' | 'in_progress' | 'completed'
          quiz_answers: Json | null
          last_position_seconds: number
          last_accessed_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          progress_percentage?: number
          status?: 'not_started' | 'in_progress' | 'completed'
          quiz_answers?: Json | null
          last_position_seconds?: number
          last_accessed_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          progress_percentage?: number
          status?: 'not_started' | 'in_progress' | 'completed'
          quiz_answers?: Json | null
          last_position_seconds?: number
          last_accessed_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          is_read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
      }
      withdrawal_requests: {
        Row: {
          id: string
          user_id: string
          amount: number
          fee_amount: number
          net_amount: number
          wallet_address: string
          network: 'TRC20' | 'ERC20'
          status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed'
          notes: string | null
          tx_hash: string | null
          created_at: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          fee_amount?: number
          net_amount?: number
          wallet_address: string
          network?: 'TRC20' | 'ERC20'
          status?: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed'
          notes?: string | null
          tx_hash?: string | null
          created_at?: string
          processed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          fee_amount?: number
          net_amount?: number
          wallet_address?: string
          network?: 'TRC20' | 'ERC20'
          status?: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed'
          notes?: string | null
          tx_hash?: string | null
          created_at?: string
          processed_at?: string | null
        }
      }
      system_settings: {
        Row: {
          id: string
          key: string
          value: string
          type: 'string' | 'number' | 'boolean' | 'json'
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          type?: 'string' | 'number' | 'boolean' | 'json'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          type?: 'string' | 'number' | 'boolean' | 'json'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_binary_downline: {
        Args: {
          root_user_id: string
          max_depth: number
        }
        Returns: {
          user_id: string
          email: string
          first_name: string
          last_name: string
          parent_id: string
          position: string
          depth: number
          left_volume: number
          right_volume: number
          status: string
        }[]
      }
      calculate_binary_commission: {
        Args: {
          target_user_id: string
          commission_date: string
        }
        Returns: number
      }
      get_direct_referrals_count: {
        Args: {
          target_user_id: string
        }
        Returns: number
      }
      calculate_leg_volume: {
        Args: {
          root_user_id: string
          leg: 'left' | 'right'
        }
        Returns: number
      }
      find_next_available_position: {
        Args: {
          sponsor_user_id: string
          preferred_leg: 'left' | 'right'
        }
        Returns: {
          parent_id: string
          position: 'left' | 'right'
        }
      }
      calculate_matching_bonus: {
        Args: {
          user_id: string
          period: string
        }
        Returns: number
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

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
