'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Calendar, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { MatchList } from '@/components/matches/MatchList'
import type { Database } from '@/types/database.types'

type Tournament = Database['public']['Tables']['tournaments']['Row']

export default function TournamentDetailPage() {
  const params = useParams()
  const tournamentId = params.id as string
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTournament = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single()

      if (!error && data) {
        setTournament(data)
      }
      setLoading(false)
    }

    fetchTournament()
  }, [tournamentId])

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

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Tournament not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tournament Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{tournament.name}</h1>
              {tournament.is_active && (
                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-semibold rounded">
                  Active
                </span>
              )}
            </div>
            {tournament.short_name && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {tournament.short_name}
              </p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm">
              {tournament.country && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {tournament.country}
                </div>
              )}
              {tournament.season && (
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Season:</span> {tournament.season}
                </div>
              )}
              {tournament.start_date && tournament.end_date && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(tournament.start_date), 'MMM d, yyyy')} -{' '}
                  {format(new Date(tournament.end_date), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Matches */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Tournament Matches</h2>
        <MatchList tournamentId={tournamentId} realtime={true} />
      </div>
    </div>
  )
}
