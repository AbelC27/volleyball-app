'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Search, MapPin, Star } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import type { Database } from '@/types/database.types'

type Team = Database['public']['Tables']['teams']['Row']

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuthStore()
  const { favoriteTeams, addFavoriteTeam, removeFavoriteTeam } = useFavoritesStore()

  useEffect(() => {
    const fetchTeams = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name', { ascending: true })

      if (!error && data) {
        setTeams(data)
        setFilteredTeams(data)
      }
      setLoading(false)
    }

    fetchTeams()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTeams(teams)
    } else {
      const filtered = teams.filter(
        (team) =>
          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.short_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTeams(filtered)
    }
  }, [searchQuery, teams])

  const handleFavoriteToggle = async (teamId: string) => {
    if (!user) return

    const supabase = createClient()
    const isFavorite = favoriteTeams.has(teamId)

    if (isFavorite) {
      await supabase
        .from('user_favorite_teams')
        .delete()
        .match({ user_id: user.id, team_id: teamId })
      removeFavoriteTeam(teamId)
    } else {
      await supabase
        .from('user_favorite_teams')
        .insert({ user_id: user.id, team_id: teamId })
      addFavoriteTeam(teamId)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Teams</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse all volleyball teams
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search teams by name or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 animate-pulse"
            >
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      ) : filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="relative group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-all"
            >
              <Link href={`/teams/${team.id}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {team.logo_url ? (
                      <Image
                        src={team.logo_url}
                        alt={team.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold">
                        {team.short_name?.[0] || team.name[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{team.name}</h3>
                    {team.short_name && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {team.short_name}
                      </p>
                    )}
                    {team.country && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-3 h-3" />
                        {team.country}
                      </div>
                    )}
                  </div>
                </div>

                {team.home_venue && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-medium">Home Venue:</span> {team.home_venue}
                  </div>
                )}

                {team.founded_year && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Founded:</span> {team.founded_year}
                  </div>
                )}
              </Link>

              {/* Favorite Button */}
              {user && (
                <button
                  onClick={() => handleFavoriteToggle(team.id)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Star
                    className={`w-4 h-4 ${
                      favoriteTeams.has(team.id)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No teams found matching your search.
          </p>
        </div>
      )}
    </div>
  )
}
