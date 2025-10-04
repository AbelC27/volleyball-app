export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'cancelled' | 'postponed'
export type SetStatus = 'not_started' | 'in_progress' | 'finished'

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string
          name: string
          short_name: string | null
          logo_url: string | null
          country: string | null
          founded_year: number | null
          home_venue: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          short_name?: string | null
          logo_url?: string | null
          country?: string | null
          founded_year?: number | null
          home_venue?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          short_name?: string | null
          logo_url?: string | null
          country?: string | null
          founded_year?: number | null
          home_venue?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tournaments: {
        Row: {
          id: string
          name: string
          short_name: string | null
          country: string | null
          logo_url: string | null
          season: string | null
          start_date: string | null
          end_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          short_name?: string | null
          country?: string | null
          logo_url?: string | null
          season?: string | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          short_name?: string | null
          country?: string | null
          logo_url?: string | null
          season?: string | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          tournament_id: string | null
          home_team_id: string | null
          away_team_id: string | null
          scheduled_at: string
          status: MatchStatus
          venue: string | null
          round: string | null
          home_score: number
          away_score: number
          current_set: number
          started_at: string | null
          finished_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tournament_id?: string | null
          home_team_id?: string | null
          away_team_id?: string | null
          scheduled_at: string
          status?: MatchStatus
          venue?: string | null
          round?: string | null
          home_score?: number
          away_score?: number
          current_set?: number
          started_at?: string | null
          finished_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tournament_id?: string | null
          home_team_id?: string | null
          away_team_id?: string | null
          scheduled_at?: string
          status?: MatchStatus
          venue?: string | null
          round?: string | null
          home_score?: number
          away_score?: number
          current_set?: number
          started_at?: string | null
          finished_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sets: {
        Row: {
          id: string
          match_id: string | null
          set_number: number
          home_points: number
          away_points: number
          status: SetStatus
          started_at: string | null
          finished_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_id?: string | null
          set_number: number
          home_points?: number
          away_points?: number
          status?: SetStatus
          started_at?: string | null
          finished_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_id?: string | null
          set_number?: number
          home_points?: number
          away_points?: number
          status?: SetStatus
          started_at?: string | null
          finished_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      players: {
        Row: {
          id: string
          team_id: string | null
          first_name: string
          last_name: string
          jersey_number: number | null
          position: string | null
          height_cm: number | null
          date_of_birth: string | null
          nationality: string | null
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team_id?: string | null
          first_name: string
          last_name: string
          jersey_number?: number | null
          position?: string | null
          height_cm?: number | null
          date_of_birth?: string | null
          nationality?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          team_id?: string | null
          first_name?: string
          last_name?: string
          jersey_number?: number | null
          position?: string | null
          height_cm?: number | null
          date_of_birth?: string | null
          nationality?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      match_events: {
        Row: {
          id: string
          match_id: string | null
          set_number: number | null
          event_type: string
          team_id: string | null
          player_id: string | null
          description: string | null
          home_score: number | null
          away_score: number | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          match_id?: string | null
          set_number?: number | null
          event_type: string
          team_id?: string | null
          player_id?: string | null
          description?: string | null
          home_score?: number | null
          away_score?: number | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string | null
          set_number?: number | null
          event_type?: string
          team_id?: string | null
          player_id?: string | null
          description?: string | null
          home_score?: number | null
          away_score?: number | null
          timestamp?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_favorite_teams: {
        Row: {
          user_id: string
          team_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          team_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          team_id?: string
          created_at?: string
        }
      }
      user_favorite_matches: {
        Row: {
          user_id: string
          match_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          match_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          match_id?: string
          created_at?: string
        }
      }
      player_stats: {
        Row: {
          id: string
          player_id: string | null
          tournament_id: string | null
          matches_played: number
          points_scored: number
          aces: number
          blocks: number
          digs: number
          assists: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id?: string | null
          tournament_id?: string | null
          matches_played?: number
          points_scored?: number
          aces?: number
          blocks?: number
          digs?: number
          assists?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string | null
          tournament_id?: string | null
          matches_played?: number
          points_scored?: number
          aces?: number
          blocks?: number
          digs?: number
          assists?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      match_status: MatchStatus
      set_status: SetStatus
    }
  }
}
