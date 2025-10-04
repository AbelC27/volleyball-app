'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import { Users, Trophy, Calendar, Settings } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const { user, isAdmin, loading } = useAuthStore()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/')
    }
  }, [user, isAdmin, loading, router])

  if (loading || !user || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const adminSections = [
    {
      title: 'Manage Teams',
      description: 'Add, edit, and delete teams',
      icon: Users,
      href: '/admin/teams',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Manage Tournaments',
      description: 'Create and manage tournaments',
      icon: Trophy,
      href: '/admin/tournaments',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Manage Matches',
      description: 'Schedule and update matches',
      icon: Calendar,
      href: '/admin/matches',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Update Live Scores',
      description: 'Real-time score updates',
      icon: Settings,
      href: '/admin/live-scores',
      color: 'from-red-500 to-red-600',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage teams, tournaments, matches, and live scores
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{section.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {section.description}
              </p>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <h3 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2">
          Admin Notice
        </h3>
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          The admin dashboard is a work in progress. Full CRUD operations for teams, tournaments, and matches will be implemented here. 
          For now, you can use the Supabase dashboard or SQL queries to manage data.
        </p>
      </div>
    </div>
  )
}
