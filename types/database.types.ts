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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          target_role: string | null
          target_company: string | null
          readiness_score: number
          selected_mentor: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          target_role?: string | null
          target_company?: string | null
          readiness_score?: number
          selected_mentor?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          target_role?: string | null
          target_company?: string | null
          readiness_score?: number
          selected_mentor?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
