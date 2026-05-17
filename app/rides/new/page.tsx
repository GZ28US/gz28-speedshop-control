'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'
import {
  years,
  manufacturersByYear,
  brandsByManufacturerAndYear,
  modelsByBrandAndYear,
  versionsByModelAndYear,
  specialEditions,
  getAvailableColors,
} from '@/lib/carData'

type Client = {
  id: string
  name: string
}

export default function NewRidePage() {
  const router = useRouter()

  const [clients, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState('')
  const [projectCode, setProjectCode] = useState('US.000')
  const [projectName, setProjectName] = useState('')
  const [vin, setVin] = useState('')
  const [plate, setPlate] = useState('')
  const [year, setYear] = useState(2023)
  const [manufacturer, setManufacturer] = useState('MOPAR')
  const [brand, setBrand] = useState('DODGE')
  const [model, setModel] = useState('CHALLENGER')
  const [version, setVersion] = useState(versionsByModelAndYear.CHALLENGER[2023][0])
  const [specialEdition, setSpecialEdition] = useState('None')
  const [color, setColor] = useState(getAvailableColors(2023, 'DODGE', 'CHALLENGER', versionsByModelAndYear.CHALLENGER[2023][0], 'None')[0])

  useEffect(() => {
    loadClients()
    loadNextProjectCode()
  }, [])

  async function loadClients() {
    const { data } = await supabase.from('clients').select('id, name').order('name', { ascending: true })
    setClients(data || [])
    if (data && data.length > 0) setClientId(data[0].id)
  }

  async function loadNextProjectCode() {
    const { data } = await supabase.from('rides').select('project_code')
    const usedNumbers = data?.map((item) => {
      const match = item.project_code?.match(/US\.(\d+)/)
      return match ? Number(match[1]) : null
    }) || []
    let nextNumber = 0
    while (usedNumbers.includes(nextNumber)) nextNumber++
    setProjectCode(`US.${String(nextNumber).padStart(3, '0')}`)
  }

  useEffect(() => {
    const available = manufacturersByYear[year] || []
    if (!available.includes(manufacturer)) setManufacturer(available[0] || '')
  }, [year, manufacturer])

  useEffect(() => {
    const available = brandsByManufacturerAndYear[manufacturer]?.[year] || []
    if (!available.includes(brand)) setBrand(available[0] || '')
  }, [year, manufacturer, brand])

  useEffect(() => {
    const available = modelsByBrandAndYear[brand]?.[year] || []
    if (!available.includes(model)) setModel(available[0] || '')
  }, [year, brand, model])

  useEffect(() => {
    const available = versionsByModelAndYear[model]?.[year] || []
    if (!available.includes(version)) setVersion(available[0] || '')
  }, [year, model, version])

  useEffect(() => {
    const key = `${year}-${model}-${version}`
    const options = specialEditions[key] || []
    setSpecialEdition(options[0] || 'None')
  }, [year, model, version])

  useEffect(() => {
    const colors = getAvailableColors(year, brand, model, version, specialEdition)
    setColor(colors[0])
  }, [year, brand, model, version, specialEdition])

  async function saveRide() {
    const { error } = await supabase.from('rides').insert([
      {
        client_id: clientId || null,
        project_code: projectCode,
        project_name: projectName,
        year,
        manufacturer,
        brand,
        model,
        version,
        special_edition: specialEdition === 'None' ? null : specialEdition,
        color,
        vin,
        plate,
      },
    ])
    if (error) {
      alert(error.message)
      return
    }
    router.push('/rides')
  }

  const availableManufacturers = manufacturersByYear[year] || []
  const availableBrands = brandsByManufacturerAndYear[manufacturer]?.[year] || []
  const availableModels = modelsByBrandAndYear[brand]?.[year] || []
  const availableVersions = versionsByModelAndYear[model]?.[year] || []
  const availableSpecialEditions = specialEditions[`${year}-${model}-${version}`] || []
  const availableColors = getAvailableColors(year, brand, model, version, specialEdition)

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <h2 className="text-4xl font-bold mb-8">ADD A NEW RIDE</h2>

      <div className="grid grid-cols-1 gap-5 max-w-2xl">
        <div>
          <label className="block mb-2 text-lg font-bold">CLIENT</label>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl">
            {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">PROJECT CODE</label>
          <input type="text" value={projectCode} onChange={(e) => setProjectCode(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">PROJECT NAME</label>
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">VIN</label>
          <input type="text" value={vin} onChange={(e) => setVin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">PLATE</label>
          <input type="text" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl" />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">YEAR</label>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl">
            {years.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">MANUFACTURER</label>
          <select value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl">
            {availableManufacturers.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">BRAND</label>
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl">
            {availableBrands.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">MODEL</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl">
            {availableModels.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">VERSION</label>
          <select value={version} onChange={(e) => setVersion(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl">
            {availableVersions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        {availableSpecialEditions.length > 0 && (
          <div>
            <label className="block mb-2 text-lg font-bold">SPECIAL EDITION</label>
            <select value={specialEdition} onChange={(e) => setSpecialEdition(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl">
              {availableSpecialEditions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="block mb-2 text-lg font-bold">COLOR</label>
          <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl">
            {availableColors.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <button onClick={saveRide} className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold">
          SAVE RIDE
        </button>

        <a href="/rides" className="text-gray-400 text-xl">Cancel</a>
      </div>
    </main>
  )
}