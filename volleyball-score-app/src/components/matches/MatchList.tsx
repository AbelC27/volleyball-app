'use client'

import { useState, useEffect } from 'react'
import { MatchCard } from './MatchCard'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Match = Database['public']['Tables']['matches']['Row'] & {
  home_team?: Database['public']['Tables']['teams']['Row']
  away_team?: Database['public']['Tables']['teams']['Row']
  tournament?: Database['public']['Tables']['tournaments']['Row']
  sets?: Database['public']['Tables']['sets']['Row'][]
}

interface MatchListProps {
  status?: 'scheduled' | 'live' | 'finished'
  tournamentId?: string
  limit?: number
  realtime?: boolean
}

export function MatchList({ status, tournamentId, limit, realtime = false }: MatchListProps) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      const supabase = createClient()
      let query = supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(*),
          away_team:teams!matches_away_team_id_fkey(*),
          tournament:tournaments(*),
          sets(*)
        `)
        .order('scheduled_at', { ascending: true })

      if (status) {
        query = query.eq('status', status)
      }

      if (tournamentId) {
        query = query.eq('tournament_id', tournamentId)
      }

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (!error && data) {
        setMatches(data as Match[])
      }
      setLoading(false)
    }

    fetchMatches()

    if (realtime) {
      const supabase = createClient()
      
      // Subscribe to match updates
      const matchesChannel = supabase
        .channel('matches-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'matches',
          },
          () => {
            fetchMatches()
          }
        )
        .subscribe()

      // Subscribe to sets updates
      const setsChannel = supabase
        .channel('sets-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'sets',
          },
          () => {
            fetchMatches()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(matchesChannel)
        supabase.removeChannel(setsChannel)
      }
    }
  }, [status, tournamentId, limit, realtime])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 animate-pulse"
          >
            <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No matches found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  )
}
