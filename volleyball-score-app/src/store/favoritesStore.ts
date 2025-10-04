import { create } from 'zustand'

interface FavoritesState {
  favoriteTeams: Set<string>
  favoriteMatches: Set<string>
  addFavoriteTeam: (teamId: string) => void
  removeFavoriteTeam: (teamId: string) => void
  addFavoriteMatch: (matchId: string) => void
  removeFavoriteMatch: (matchId: string) => void
  setFavoriteTeams: (teams: string[]) => void
  setFavoriteMatches: (matches: string[]) => void
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
  favoriteTeams: new Set(),
  favoriteMatches: new Set(),
  addFavoriteTeam: (teamId) =>
    set((state) => ({
      favoriteTeams: new Set(state.favoriteTeams).add(teamId),
    })),
  removeFavoriteTeam: (teamId) =>
    set((state) => {
      const newFavorites = new Set(state.favoriteTeams)
      newFavorites.delete(teamId)
      return { favoriteTeams: newFavorites }
    }),
  addFavoriteMatch: (matchId) =>
    set((state) => ({
      favoriteMatches: new Set(state.favoriteMatches).add(matchId),
    })),
  removeFavoriteMatch: (matchId) =>
    set((state) => {
      const newFavorites = new Set(state.favoriteMatches)
      newFavorites.delete(matchId)
      return { favoriteMatches: newFavorites }
    }),
  setFavoriteTeams: (teams) =>
    set({ favoriteTeams: new Set(teams) }),
  setFavoriteMatches: (matches) =>
    set({ favoriteMatches: new Set(matches) }),
}))
