'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Star, LogOut } from 'lucide-react'
import { MatchCard } from '@/components/matches/MatchCard'
import type { Database } from '@/types/database.types'

type Match = Database['public']['Tables']['matches']['Row'] & {
  home_team?: Database['public']['Tables']['teams']['Row']
  away_team?: Database['public']['Tables']['teams']['Row']
  tournament?: Database['public']['Tables']['tournaments']['Row']
}

type Team = Database['public']['Tables']['teams']['Row']

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuthStore()
  const { favoriteMatches, favoriteTeams } = useFavoritesStore()
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return

      const supabase = createClient()

      // Fetch favorite matches
      if (favoriteMatches.size > 0) {
        const { data: matchesData } = await supabase
          .from('matches')
          .select(`
            *,
            home_team:teams!matches_home_team_id_fkey(*),
            away_team:teams!matches_away_team_id_fkey(*),
            tournament:tournaments(*)
          `)
          .in('id', Array.from(favoriteMatches))

        if (matchesData) {
          setMatches(matchesData as Match[])
        }
      }

      // Fetch favorite teams
      if (favoriteTeams.size > 0) {
        const { data: teamsData } = await supabase
          .from('teams')
          .select('*')
          .in('id', Array.from(favoriteTeams))

        if (teamsData) {
          setTeams(teamsData)
        }
      }

      setLoading(false)
    }

    fetchFavorites()
  }, [user, favoriteMatches, favoriteTeams])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8" />
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {user.user_metadata?.full_name || 'User'}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
              {user.user_metadata?.username && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                  <User className="w-4 h-4" />
                  @{user.user_metadata.username}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Favorite Teams */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          Favorite Teams ({teams.length})
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 animate-pulse"
              >
                <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            ))}
          </div>
        ) : teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-lg font-bold">
                      {team.short_name?.[0] || team.name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold">{team.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {team.country}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              No favorite teams yet. Start following teams to see them here!
            </p>
          </div>
        )}
      </section>

      {/* Favorite Matches */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          Favorite Matches ({matches.length})
        </h2>
        {loading ? (
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
        ) : matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              No favorite matches yet. Star matches to see them here!
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
