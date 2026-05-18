'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import DatePicker from '@/components/DatePicker'
import { supabase } from '@/lib/supabase'

export default function EditSeasonPage() {
  const params = useParams()
  const router = useRouter()
  const staffId = String(params.id)
  const seasonID = String(params.seasonID)

  const [loading, setLoading] = useState(true)
  const [staffName, setStaffName] = useState('')
  const [seasonCode, setSeasonCode] = useState('')
  const [dateEntry, setDateEntry] = useState('')
  const [dateConclusion, setDateConclusion] = useState('')

  useEffect(() => {
    loadStaffName()
    loadSeason()
  }, [])

  async function loadStaffName() {
    const { data } = await supabase
      .from('staff')
      .select('name')
      .eq('id', staffId)
      .single()

    setStaffName(data?.name || '')
  }

  async function loadSeason() {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('id', seasonID)
      .single()

    if (error || !data) {
      alert('Season not found')
      router.push(`/staff/${staffId}/seasons`)
      return
    }

    setSeasonCode(data.season_code || '')
    setDateEntry(data.date_entry || '')
    setDateConclusion(data.date_conclusion || '')
    setLoading(false)
  }

  function isValidDate(d: string) {
    return !!d && d.match(/^\d{4}-\d{2}-\d{2}$/) !== null
  }

  async function saveSeason() {
    const { error } = await supabase
      .from('seasons')
      .update({
        season_code: seasonCode,
        date_entry: isValidDate(dateEntry) ? dateEntry : null,
        date_conclusion: isValidDate(dateConclusion) ? dateConclusion : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', seasonID)

    if (error) {
      alert(error.message)
      return
    }

    router.push(`/staff/${staffId}/seasons`)
  }

  const inputClass = 'w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl'

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <Header />
        <p className="text-2xl text-gray-400">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <h1 className="text-4xl font-bold mb-2">EDIT SEASON</h1>
      <p className="text-gray-400 text-xl mb-8">{staffName}</p>

      <div className="grid grid-cols-1 gap-5 max-w-2xl">

        <div>
          <label className="block mb-2 text-lg font-bold">SEASON CODE</label>
          <input
            value={seasonCode}
            onChange={(e) => setSeasonCode(e.target.value)}
            className={inputClass}
          />
        </div>

        <DatePicker
          label="DATE OF ENTRY"
          value={dateEntry}
          onChange={setDateEntry}
        />

        <DatePicker
          label="DATE OF CONCLUSION"
          value={dateConclusion}
          onChange={setDateConclusion}
        />

        <button
          onClick={saveSeason}
          className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold"
        >
          SAVE CHANGES
        </button>

        <a href={`/staff/${staffId}/seasons`} className="text-gray-400 text-xl">Cancel</a>
      </div>
    </main>
  )
}