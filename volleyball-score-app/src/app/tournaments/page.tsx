'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Calendar, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import type { Database } from '@/types/database.types'

type Tournament = Database['public']['Tables']['tournaments']['Row']

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTournaments = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: false })

      if (!error && data) {
        setTournaments(data)
      }
      setLoading(false)
    }

    fetchTournaments()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tournaments</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse all volleyball tournaments and leagues
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 animate-pulse"
            >
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      ) : tournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Link
              key={tournament.id}
              href={`/tournaments/${tournament.id}`}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-all hover:border-blue-500 dark:hover:border-blue-500"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tournament.name}
                    </h3>
                  </div>
                  {tournament.short_name && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tournament.short_name}
                    </p>
                  )}
                </div>
                {tournament.is_active && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold rounded">
                    Active
                  </span>
                )}
              </div>

              {tournament.country && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  {tournament.country}
                </div>
              )}

              {tournament.season && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-medium">Season:</span> {tournament.season}
                </div>
              )}

              {tournament.start_date && tournament.end_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(tournament.start_date), 'MMM d, yyyy')} -{' '}
                  {format(new Date(tournament.end_date), 'MMM d, yyyy')}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No tournaments found.
          </p>
        </div>
      )}
    </div>
  )
}
