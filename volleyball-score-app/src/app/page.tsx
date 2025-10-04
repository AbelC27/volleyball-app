import { format } from 'date-fns'
import { Calendar, TrendingUp, Users } from 'lucide-react'
import { MatchList } from '@/components/matches/MatchList'
import Link from 'next/link'

export default function Home() {
  const today = format(new Date(), 'EEEE, MMMM d, yyyy')

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Live Volleyball Scores
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          {today}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Real-time updates • Match schedules • Tournament standings
        </p>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link
          href="/matches?status=live"
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Live Now</p>
              <p className="text-3xl font-bold">--</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Link>

        <Link
          href="/matches?status=scheduled"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Today&apos;s Matches</p>
              <p className="text-3xl font-bold">--</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </Link>

        <Link
          href="/teams"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Active Teams</p>
              <p className="text-3xl font-bold">--</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Link>
      </div>

      {/* Live Matches */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            Live Matches
          </h2>
          <Link
            href="/matches?status=live"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            View all
          </Link>
        </div>
        <MatchList status="live" limit={5} realtime={true} />
      </section>

      {/* Upcoming Matches */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Upcoming Matches</h2>
          <Link
            href="/matches?status=scheduled"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            View all
          </Link>
        </div>
        <MatchList status="scheduled" limit={5} />
      </section>

      {/* Recent Results */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Results</h2>
          <Link
            href="/matches?status=finished"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            View all
          </Link>
        </div>
        <MatchList status="finished" limit={5} />
      </section>
    </div>
  )
}
