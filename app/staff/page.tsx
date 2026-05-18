'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

type StaffMember = {
  id: string
  name: string
  position: string
  latestConclusion: string | null
  hasActiveseason: boolean
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    loadStaff()
  }, [])

  async function loadStaff() {
    const { data: staffData } = await supabase
      .from('staff')
      .select('*')
      .order('name', { ascending: true })

    if (!staffData) {
      setLoading(false)
      return
    }

    const { data: seasonsData } = await supabase
      .from('seasons')
      .select('staff_id, date_conclusion')

    const staffWithSeasons: StaffMember[] = staffData.map((member) => {
      const memberSeasons = seasonsData?.filter(s => s.staff_id === member.id) || []
      const hasActiveSeason = memberSeasons.some(s => !s.date_conclusion)
      const concluded = memberSeasons
        .filter(s => s.date_conclusion)
        .map(s => s.date_conclusion)
        .sort((a, b) => b.localeCompare(a))
      const latestConclusion = concluded[0] || null

      return {
        ...member,
        latestConclusion,
        hasActiveseason: hasActiveSeason,
      }
    })

    // Sort: active (no conclusion) first, then by latest conclusion descending
    staffWithSeasons.sort((a, b) => {
      if (a.hasActiveseason && !b.hasActiveseason) return -1
      if (!a.hasActiveseason && b.hasActiveseason) return 1
      if (a.latestConclusion && b.latestConclusion) {
        return b.latestConclusion.localeCompare(a.latestConclusion)
      }
      if (a.latestConclusion && !b.latestConclusion) return 1
      if (!a.latestConclusion && b.latestConclusion) return -1
      return a.name.localeCompare(b.name)
    })

    setStaff(staffWithSeasons)
    setLoading(false)
  }

  async function removeStaff(id: string) {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    setConfirmId(null)
    loadStaff()
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      {confirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-sm w-full mx-4">
            <h2 className="text-2xl font-bold mb-2">Remove Staff Member</h2>
            <p className="text-gray-400 text-lg mb-8">Are you sure you want to remove this staff member? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-5 py-4 rounded-2xl font-bold text-xl"
              >
                CANCEL
              </button>
              <button
                onClick={() => removeStaff(confirmId)}
                className="flex-1 bg-red-700 hover:bg-red-600 px-5 py-4 rounded-2xl font-bold text-xl"
              >
                REMOVE
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">
          STAFF ({staff.length})
        </h1>

        <Link
          href="/staff/new"
          className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold"
        >
          ADD A NEW STAFF MEMBER
        </Link>
      </div>

      {loading ? (
        <p className="text-2xl text-gray-400">Loading...</p>
      ) : staff.length === 0 ? (
        <p className="text-2xl text-gray-400">No staff members yet.</p>
      ) : (
        <div className="space-y-5">
          {staff.map((member) => (
            <div
              key={member.id}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex items-center justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold">{member.name}</h2>
                <p className="text-lg text-gray-400">{member.position}</p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Link
                  href={`/staff/${member.id}/seasons`}
                  className="bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-2xl font-bold"
                >
                  SEASONS
                </Link>

                <Link
                  href={`/staff/edit/${member.id}`}
                  className="bg-blue-700 hover:bg-blue-600 px-5 py-3 rounded-2xl font-bold"
                >
                  EDIT
                </Link>

                <button
                  onClick={() => setConfirmId(member.id)}
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