'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { Clock, MapPin, Calendar, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'
import Image from 'next/image'

type Match = Database['public']['Tables']['matches']['Row'] & {
  home_team?: Database['public']['Tables']['teams']['Row']
  away_team?: Database['public']['Tables']['teams']['Row']
  tournament?: Database['public']['Tables']['tournaments']['Row']
  sets?: Database['public']['Tables']['sets']['Row'][]
}

export default function MatchDetailPage() {
  const params = useParams()
  const matchId = params.id as string
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatch = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(*),
          away_team:teams!matches_away_team_id_fkey(*),
          tournament:tournaments(*),
          sets(*)
        `)
        .eq('id', matchId)
        .single()

      if (!error && data) {
        setMatch(data as Match)
      }
      setLoading(false)
    }

    fetchMatch()

    // Subscribe to real-time updates
    const supabase = createClient()
    const channel = supabase
      .channel(`match-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        () => {
          fetchMatch()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sets',
          filter: `match_id=eq.${matchId}`,
        },
        () => {
          fetchMatch()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8" />
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Match not found</p>
        </div>
      </div>
    )
  }

  const statusColors = {
    scheduled: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    live: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    finished: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    postponed: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  }

  const statusLabels = {
    scheduled: 'Scheduled',
    live: 'LIVE',
    finished: 'Finished',
    cancelled: 'Cancelled',
    postponed: 'Postponed',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tournament Info */}
      {match.tournament && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {match.tournament.name} {match.round && `• ${match.round}`}
          </p>
        </div>
      )}

      {/* Match Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[match.status]}`}>
              {statusLabels[match.status]}
            </span>
            {match.status === 'live' && (
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-4 h-4" />
                Set {match.current_set}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(match.scheduled_at), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {format(new Date(match.scheduled_at), 'HH:mm')}
            </div>
          </div>
        </div>

        {/* Teams & Score */}
        <div className="space-y-6">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {match.home_team?.logo_url ? (
                  <Image
                    src={match.home_team.logo_url}
                    alt={match.home_team.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold">
                    {match.home_team?.short_name?.[0] || 'H'}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{match.home_team?.name || 'Home Team'}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{match.home_team?.country}</p>
              </div>
            </div>
            {(match.status === 'live' || match.status === 'finished') && (
              <div className="text-5xl font-bold">{match.home_score}</div>
            )}
          </div>

          <div className="text-center text-sm text-gray-400">vs</div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {match.away_team?.logo_url ? (
                  <Image
                    src={match.away_team.logo_url}
                    alt={match.away_team.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold">
                    {match.away_team?.short_name?.[0] || 'A'}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{match.away_team?.name || 'Away Team'}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{match.away_team?.country}</p>
              </div>
            </div>
            {(match.status === 'live' || match.status === 'finished') && (
              <div className="text-5xl font-bold">{match.away_score}</div>
            )}
          </div>
        </div>

        {/* Venue */}
        {match.venue && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              {match.venue}
            </div>
          </div>
        )}
      </div>

      {/* Set-by-Set Breakdown */}
      {match.sets && match.sets.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Set-by-Set Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4">Team</th>
                  {match.sets.map((set) => (
                    <th key={set.set_number} className="text-center py-3 px-4">
                      Set {set.set_number}
                    </th>
                  ))}
                  <th className="text-center py-3 px-4 font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-3 px-4 font-medium">{match.home_team?.name}</td>
                  {match.sets.map((set) => (
                    <td
                      key={set.set_number}
                      className={`text-center py-3 px-4 font-semibold ${
                        set.home_points > set.away_points
                          ? 'text-green-600 dark:text-green-400'
                          : ''
                      }`}
                    >
                      {set.home_points}
                    </td>
                  ))}
                  <td className="text-center py-3 px-4 font-bold text-lg">
                    {match.home_score}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">{match.away_team?.name}</td>
                  {match.sets.map((set) => (
                    <td
                      key={set.set_number}
                      className={`text-center py-3 px-4 font-semibold ${
                        set.away_points > set.home_points
                          ? 'text-green-600 dark:text-green-400'
                          : ''
                      }`}
                    >
                      {set.away_points}
                    </td>
                  ))}
                  <td className="text-center py-3 px-4 font-bold text-lg">
                    {match.away_score}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
