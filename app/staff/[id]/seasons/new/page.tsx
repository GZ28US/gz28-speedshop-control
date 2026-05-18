'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

export default function NewSeasonPage() {
  const params = useParams()
  const router = useRouter()
  const staffId = String(params.id)

  const [staffName, setStaffName] = useState('')
  const [seasonCode, setSeasonCode] = useState('US.001')
  const [dateEntry, setDateEntry] = useState('')
  const [dateConclusion, setDateConclusion] = useState('')

  useEffect(() => {
    loadStaffName()
    loadNextSeasonCode()
  }, [])

  async function loadStaffName() {
    const { data } = await supabase
      .from('staff')
      .select('name')
      .eq('id', staffId)
      .single()

    setStaffName(data?.name || '')
  }

  async function loadNextSeasonCode() {
    const { data } = await supabase
      .from('seasons')
      .select('season_code')

    const usedNumbers = data?.map((item) => {
      const match = item.season_code?.match(/US\.(\d+)/)
      return match ? Number(match[1]) : null
    }) || []

    let nextNumber = 1
    while (usedNumbers.includes(nextNumber)) nextNumber++

    setSeasonCode(`US.${String(nextNumber).padStart(3, '0')}`)
  }

  async function saveSeason() {
    const { error } = await supabase
      .from('seasons')
      .insert([{
        season_code: seasonCode,
        staff_id: staffId,
        date_entry: dateEntry || null,
        date_conclusion: dateConclusion || null,
      }])

    if (error) {
      alert(error.message)
      return
    }

    router.push(`/staff/${staffId}/seasons`)
  }

  const inputClass = 'w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl'

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <h1 className="text-4xl font-bold mb-2">ADD NEW SEASON</h1>
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

        <div>
          <label className="block mb-2 text-lg font-bold">DATE OF ENTRY</label>
          <input
            type="date"
            value={dateEntry}
            onChange={(e) => setDateEntry(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">DATE OF CONCLUSION</label>
          <input
            type="date"
            value={dateConclusion}
            onChange={(e) => setDateConclusion(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          onClick={saveSeason}
          className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold"
        >
          SAVE SEASON
        </button>

        <a href={`/staff/${staffId}/seasons`} className="text-gray-400 text-xl">Cancel</a>
      </div>
    </main>
  )
}