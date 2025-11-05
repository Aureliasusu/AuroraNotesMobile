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
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          tags: string[]
          is_archived: boolean
          is_pinned: boolean
          folder_id: string | null
          word_count: number
          reading_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          tags?: string[]
          is_archived?: boolean
          is_pinned?: boolean
          folder_id?: string | null
          word_count?: number
          reading_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          tags?: string[]
          is_archived?: boolean
          is_pinned?: boolean
          folder_id?: string | null
          word_count?: number
          reading_time?: number
          created_at?: string
          updated_at?: string
        }
      }
      folders: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_analysis: {
        Row: {
          id: string
          note_id: string
          summary: string
          key_points: string[]
          todo_items: string[]
          sentiment: string
          created_at: string
        }
        Insert: {
          id?: string
          note_id: string
          summary: string
          key_points?: string[]
          todo_items?: string[]
          sentiment?: string
          created_at?: string
        }
        Update: {
          id?: string
          note_id?: string
          summary?: string
          key_points?: string[]
          todo_items?: string[]
          sentiment?: string
          created_at?: string
        }
      }
    }
    Views: {
      // eslint-disable-next-line no-unused-vars
      [_ in never]: never
    }
    Functions: {
      // eslint-disable-next-line no-unused-vars
      [_ in never]: never
    }
    Enums: {
      // eslint-disable-next-line no-unused-vars
      [_ in never]: never
    }
  }
}

// Export common types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Note = Database['public']['Tables']['notes']['Row']
export type Folder = Database['public']['Tables']['folders']['Row']
export type AIAnalysis = Database['public']['Tables']['ai_analysis']['Row']

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type NoteInsert = Database['public']['Tables']['notes']['Insert']
export type FolderInsert = Database['public']['Tables']['folders']['Insert']
export type AIAnalysisInsert = Database['public']['Tables']['ai_analysis']['Insert']

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type NoteUpdate = Database['public']['Tables']['notes']['Update']
export type FolderUpdate = Database['public']['Tables']['folders']['Update']
export type AIAnalysisUpdate = Database['public']['Tables']['ai_analysis']['Update']