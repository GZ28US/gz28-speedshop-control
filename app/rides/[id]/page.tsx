'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

export default function EditRidePage() {
  const params = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [clientId, setClientId] = useState('')
  const [projectCode, setProjectCode] = useState('')
  const [projectName, setProjectName] = useState('')
  const [year, setYear] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [version, setVersion] = useState('')
  const [specialEdition, setSpecialEdition] = useState('')
  const [color, setColor] = useState('')
  const [vin, setVin] = useState('')
  const [plate, setPlate] = useState('')

  useEffect(() => {
    loadRide()
  }, [])

  async function loadRide() {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      alert('Ride not found')
      router.push('/rides')
      return
    }

    setClientId(data.client_id || '')
    setProjectCode(data.project_code || '')
    setProjectName(data.project_name || '')
    setYear(data.year?.toString() || '')
    setManufacturer(data.manufacturer || '')
    setBrand(data.brand || '')
    setModel(data.model || '')
    setVersion(data.version || '')
    setSpecialEdition(data.special_edition || 'None')
    setColor(data.color || '')
    setVin(data.vin || '')
    setPlate(data.plate || '')

    setLoading(false)
  }

  async function updateRide() {
    const { error } = await supabase
      .from('rides')
      .update({
        client_id: clientId || null,
        project_code: projectCode,
        project_name: projectName,
        year: Number(year),
        manufacturer,
        brand,
        model,
        version,
        special_edition:
          specialEdition === 'None'
            ? null
            : specialEdition,
        color,
        vin,
        plate,
      })
      .eq('id', params.id)

    if (error) {
      alert(error.message)
      return
    }

    router.push('/rides')
  }

  async function deleteRide() {
    const confirmDelete = confirm(
      'Delete this ride?'
    )

    if (!confirmDelete) return

    const { error } = await supabase
      .from('rides')
      .delete()
      .eq('id', params.id)

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
        <p className="text-2xl">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <h2 className="text-4xl font-bold mb-8">
        EDIT RIDE
      </h2>

      <div className="grid grid-cols-1 gap-5 max-w-2xl">
        <div>
          <label className="block mb-2 text-lg font-bold">
            PROJECT CODE
          </label>

          <input
            type="text"
            value={projectCode}
            onChange={(e) =>
              setProjectCode(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">
            PROJECT NAME
          </label>

          <input
            type="text"
            value={projectName}
            onChange={(e) =>
              setProjectName(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">
            VIN
          </label>

          <input
            type="text"
            value={vin}
            onChange={(e) =>
              setVin(
                e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, '')
              )
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">
            PLATE
          </label>

          <input
            type="text"
            value={plate}
            onChange={(e) =>
              setPlate(
                e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, '')
              )
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">
            YEAR
          </label>

          <input
            type="text"
            value={year}
            onChange={(e) =>
              setYear(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">
            MANUFACTURER
          </label>

          <input
            type="text"
            value={manufacturer}
            onChange={(e) =>
              setManufacturer(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">
            BRAND
          </label>

          <input
            type="text"
            value={brand}
            onChange={(e) =>
              setBrand(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">
            MODEL
          </label>

          <input
            type="text"
            value={model}
            onChange={(e) =>
              setModel(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">
            VERSION
          </label>

          <input
            type="text"
            value={version}
            onChange={(e) =>
              setVersion(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">
            SPECIAL EDITION
          </label>

          <input
            type="text"
            value={specialEdition}
            onChange={(e) =>
              setSpecialEdition(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">
            COLOR
          </label>

          <input
            type="text"
            value={color}
            onChange={(e) =>
              setColor(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          />
        </div>

        <button
          onClick={updateRide}
          className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold"
        >
          SAVE CHANGES
        </button>

        <button
          onClick={deleteRide}
          className="bg-red-700 hover:bg-red-600 px-6 py-4 rounded-2xl text-xl font-bold"
        >
          DELETE RIDE
        </button>

        <a
          href="/rides"
          className="text-gray-400 text-xl"
        >
          Cancel
        </a>
      </div>
    </main>
  )
}