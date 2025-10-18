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
      // Aquí puedes agregar tus tablas personalizadas
      // Ejemplo:
      // profiles: {
      //   Row: {
      //     id: string
      //     username: string | null
      //     avatar_url: string | null
      //     created_at: string
      //   }
      //   Insert: {
      //     id: string
      //     username?: string | null
      //     avatar_url?: string | null
      //     created_at?: string
      //   }
      //   Update: {
      //     id?: string
      //     username?: string | null
      //     avatar_url?: string | null
      //     created_at?: string
      //   }
      // }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
