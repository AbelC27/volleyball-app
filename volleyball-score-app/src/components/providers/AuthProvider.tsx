'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { createClient } from '@/lib/supabase/client'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, user } = useAuthStore()
  const { setFavoriteTeams, setFavoriteMatches } = useFavoritesStore()

  useEffect(() => {
    checkAuth()

    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().setUser(session?.user ?? null)
      checkAuth()
    })

    return () => subscription.unsubscribe()
  }, [checkAuth])

  useEffect(() => {
    if (user) {
      const supabase = createClient()
      
      // Load favorite teams
      supabase
        .from('user_favorite_teams')
        .select('team_id')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) {
            setFavoriteTeams(data.map((item) => item.team_id))
          }
        })

      // Load favorite matches
      supabase
        .from('user_favorite_matches')
        .select('match_id')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) {
            setFavoriteMatches(data.map((item) => item.match_id))
          }
        })
    }
  }, [user, setFavoriteTeams, setFavoriteMatches])

  return <>{children}</>
}
