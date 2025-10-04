'use client'

import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Clock, MapPin, Star } from 'lucide-react'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useAuthStore } from '@/store/authStore'
import { createClient } from '@/lib/supabase/client'
import type { MatchStatus } from '@/types/database.types'

interface Team {
  id: string
  name: string
  short_name: string | null
  logo_url: string | null
}

interface Tournament {
  id: string
  name: string
  short_name: string | null
}

interface Set {
  set_number: number
  home_points: number
  away_points: number
}

interface Match {
  id: string
  home_team_id: string | null
  away_team_id: string | null
  scheduled_at: string
  status: MatchStatus
  home_score: number
  away_score: number
  venue: string | null
  home_team?: Team
  away_team?: Team
  tournament?: Tournament
  sets?: Set[]
}

interface MatchCardProps {
  match: Match
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

export function MatchCard({ match }: MatchCardProps) {
  const { favoriteMatches, addFavoriteMatch, removeFavoriteMatch } = useFavoritesStore()
  const { user } = useAuthStore()
  const isFavorite = favoriteMatches.has(match.id)

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) return

    const supabase = createClient()

    if (isFavorite) {
      await supabase
        .from('user_favorite_matches')
        .delete()
        .match({ user_id: user.id, match_id: match.id })
      removeFavoriteMatch(match.id)
    } else {
      await supabase
        .from('user_favorite_matches')
        .insert({ user_id: user.id, match_id: match.id })
      addFavoriteMatch(match.id)
    }
  }

  return (
    <Link href={`/matches/${match.id}`}>
      <div className="relative group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-500">
        {/* Tournament Badge */}
        {match.tournament && (
          <div className="mb-3">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {match.tournament.short_name || match.tournament.name}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          {/* Teams */}
          <div className="flex-1 space-y-3">
            {/* Home Team */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {match.home_team?.logo_url ? (
                  <Image src={match.home_team.logo_url} alt={match.home_team.name} width={32} height={32} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold">
                    {match.home_team?.short_name?.[0] || 'H'}
                  </span>
                )}
              </div>
              <span className="font-medium flex-1">
                {match.home_team?.name || 'Home Team'}
              </span>
              {(match.status === 'live' || match.status === 'finished') && (
                <span className="text-2xl font-bold min-w-[2rem] text-right">
                  {match.home_score}
                </span>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {match.away_team?.logo_url ? (
                  <Image src={match.away_team.logo_url} alt={match.away_team.name} width={32} height={32} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold">
                    {match.away_team?.short_name?.[0] || 'A'}
                  </span>
                )}
              </div>
              <span className="font-medium flex-1">
                {match.away_team?.name || 'Away Team'}
              </span>
              {(match.status === 'live' || match.status === 'finished') && (
                <span className="text-2xl font-bold min-w-[2rem] text-right">
                  {match.away_score}
                </span>
              )}
            </div>
          </div>

          {/* Status & Time */}
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[match.status]}`}>
              {statusLabels[match.status]}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              {format(new Date(match.scheduled_at), 'HH:mm')}
            </div>
          </div>
        </div>

        {/* Set Scores */}
        {match.sets && match.sets.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex gap-2">
              {match.sets.map((set) => (
                <div
                  key={set.set_number}
                  className="flex-1 bg-gray-50 dark:bg-gray-800 rounded px-2 py-1 text-center"
                >
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Set {set.set_number}
                  </div>
                  <div className="text-sm font-semibold">
                    {set.home_points}-{set.away_points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Venue */}
        {match.venue && (
          <div className="mt-3 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <MapPin className="w-3 h-3" />
            {match.venue}
          </div>
        )}

        {/* Favorite Button */}
        {user && (
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <Star
              className={`w-4 h-4 ${
                isFavorite
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-400'
              }`}
            />
          </button>
        )}
      </div>
    </Link>
  )
}
