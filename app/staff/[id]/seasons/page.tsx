'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

type Season = {
  id: string
  season_code: string
  date_entry: string | null
  date_conclusion: string | null
}

type StaffMember = {
  id: string
  name: string
}

export default function SeasonsPage() {
  const params = useParams()
  const staffId = String(params.id)

  const [staff, setStaff] = useState<StaffMember | null>(null)
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    loadStaff()
    loadSeasons()
  }, [])

  async function loadStaff() {
    const { data } = await supabase
      .from('staff')
      .select('id, name')
      .eq('id', staffId)
      .single()

    setStaff(data || null)
  }

  async function loadSeasons() {
    const { data } = await supabase
      .from('seasons')
      .select('*')
      .eq('staff_id', staffId)
      .order('season_code', { ascending: true })

    setSeasons(data || [])
    setLoading(false)
  }

  async function removeSeason(id: string) {
    const { error } = await supabase
      .from('seasons')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    setConfirmId(null)
    loadSeasons()
  }

  function formatDate(date: string | null) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      {confirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-sm w-full mx-4">
            <h2 className="text-2xl font-bold mb-2">Remove Season</h2>
            <p className="text-gray-400 text-lg mb-8">Are you sure you want to remove this season? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-5 py-4 rounded-2xl font-bold text-xl"
              >
                CANCEL
              </button>
              <button
                onClick={() => removeSeason(confirmId)}
                className="flex-1 bg-red-700 hover:bg-red-600 px-5 py-4 rounded-2xl font-bold text-xl"
              >
                REMOVE
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            {staff?.name} — SEASONS ({seasons.length})
          </h1>
        </div>

        <div className="flex gap-4">
          <Link
            href="/staff"
            className="bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-2xl text-xl font-bold"
          >
            BACK
          </Link>
          <Link
            href={`/staff/${staffId}/seasons/new`}
            className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold"
          >
            ADD NEW SEASON
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-2xl text-gray-400">Loading...</p>
      ) : seasons.length === 0 ? (
        <p className="text-2xl text-gray-400">No seasons yet.</p>
      ) : (
        <div className="space-y-5">
          {seasons.map((season) => (
            <div
              key={season.id}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex items-center justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold">{season.season_code}</h2>
                <p className="text-lg text-gray-400">Entry: {formatDate(season.date_entry)}</p>
                <p className="text-lg text-gray-400">Conclusion: {formatDate(season.date_conclusion)}</p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Link
                  href={`/staff/${staffId}/seasons/edit/${season.id}`}
                  className="bg-blue-700 hover:bg-blue-600 px-5 py-3 rounded-2xl font-bold"
                >
                  EDIT
                </Link>

                <button className="bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-2xl font-bold">
                  EXPENSES
                </button>

                <button
                  onClick={() => setConfirmId(season.id)}
                  className="bg-red-700 hover:bg-red-600 px-5 py-3 rounded-2xl font-bold"
                >
                  REMOVE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}