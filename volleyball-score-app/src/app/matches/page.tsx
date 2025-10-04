'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'
import { MatchList } from '@/components/matches/MatchList'

export default function MatchesPage() {
  const searchParams = useSearchParams()
  const statusParam = searchParams.get('status') as 'scheduled' | 'live' | 'finished' | null
  const [status, setStatus] = useState<'scheduled' | 'live' | 'finished' | 'all'>(
    statusParam || 'all'
  )

  const tabs = [
    { id: 'all', label: 'All Matches' },
    { id: 'live', label: 'Live' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'finished', label: 'Finished' },
  ] as const

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Matches</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse all volleyball matches across tournaments
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Filter className="w-4 h-4" />
          Filter:
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatus(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                status === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Match List */}
      <MatchList
        status={status === 'all' ? undefined : status}
        realtime={status === 'live'}
      />
    </div>
  )
}
