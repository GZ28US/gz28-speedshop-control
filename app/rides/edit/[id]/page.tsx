'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

export default function EditRidePage() {
  const params = useParams()
  const router = useRouter()

  const rideId = String(params.id)

  const [loading, setLoading] = useState(true)

  const [projectCode, setProjectCode] = useState('')
  const [projectName, setProjectName] = useState('')
  const [vin, setVin] = useState('')
  const [plate, setPlate] = useState('')
  const [year, setYear] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [version, setVersion] = useState('')
  const [specialEdition, setSpecialEdition] = useState('')
  const [color, setColor] = useState('')

  useEffect(() => {
    loadRide()
  }, [])

  async function loadRide() {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('id', rideId)
      .single()

    if (error || !data) {
      alert('Ride not found')
      router.push('/rides')
      return
    }

    setProjectCode(data.project_code || '')
    setProjectName(data.project_name || '')
    setVin(data.vin || '')
    setPlate(data.plate || '')
    setYear(String(data.year || ''))
    setManufacturer(data.manufacturer || '')
    setBrand(data.brand || '')
    setModel(data.model || '')
    setVersion(data.version || '')
    setSpecialEdition(data.special_edition || '')
    setColor(data.color || '')

    setLoading(false)
  }

  async function saveRide() {
    const { error } = await supabase
      .from('rides')
      .update({
        project_code: projectCode,
        project_name: projectName,
        vin,
        plate,
        year: Number(year),
        manufacturer,
        brand,
        model,
        version,
        special_edition: specialEdition || null,
        color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', rideId)

    if (error) {
      alert(error.message)
      return
    }

    router.push('/rides')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <Header />
        <p className="text-2xl text-gray-400">Loading ride...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <h1 className="text-4xl font-bold mb-8">
        EDIT RIDE
      </h1>

      <div className="grid grid-cols-1 gap-5 max-w-2xl">
        <input className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" value={projectCode} onChange={(e) => setProjectCode(e.target.value)} placeholder="PROJECT CODE" />

        <input className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="PROJECT NAME" />

        <input className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" value={vin} onChange={(e) => setVin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} placeholder="VIN" />

        <input className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} placeholder="PLATE" />

        <input className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" value={year} onChange={(e) => setYear(e.target.value)} placeholder="YEAR" />

        <input className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} placeholder="MANUFACTURER" />

        <input className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="BRAND" />

        <input className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" value={model} onChange={(e) => setModel(e.target.value)} placeholder="MODEL" />

        <input className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="VERSION" />

        <input className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" value={specialEdition} onChange={(e) => setSpecialEdition(e.target.value)} placeholder="SPECIAL EDITION" />

        <input className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" value={color} onChange={(e) => setColor(e.target.value)} placeholder="COLOR" />

        <button
          onClick={saveRide}
          className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold"
        >
          SAVE CHANGES
        </button>

        <a href="/rides" className="text-gray-400 text-xl">
          Cancel
        </a>
      </div>
    </main>
  )
}