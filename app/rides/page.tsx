'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

type Client = {
  id: string
  name: string
}

const years = [
  2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
  2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
]

const manufacturersByYear: Record<number, string[]> = {
  2009: ['MOPAR'],
  2010: ['MOPAR'],
  2011: ['MOPAR'],
  2012: ['MOPAR'],
  2013: ['MOPAR'],
  2014: ['GM'],
  2015: ['MOPAR', 'GM'],
  2016: ['MOPAR', 'GM'],
  2017: ['MOPAR', 'GM'],
  2018: ['MOPAR', 'GM'],
  2019: ['MOPAR', 'GM'],
  2020: ['MOPAR', 'GM'],
  2021: ['MOPAR', 'GM'],
  2022: ['MOPAR', 'GM'],
  2023: ['MOPAR', 'GM'],
  2024: ['GM'],
  2025: ['GM'],
  2026: ['GM'],
}

const brandsByManufacturerAndYear: Record<string, Record<number, string[]>> = {
  MOPAR: {
    2009: ['RAM'],
    2010: ['RAM'],
    2011: ['RAM'],
    2012: ['RAM'],
    2013: ['RAM'],
    2014: ['RAM'],
    2015: ['RAM'],
    2016: ['RAM'],
    2017: ['RAM'],
    2018: ['DODGE', 'RAM'],
    2019: ['DODGE'],
    2020: ['DODGE'],
    2021: ['DODGE'],
    2022: ['DODGE'],
    2023: ['DODGE'],
  },

  GM: {
    2014: ['CHEVROLET'],
    2015: ['CHEVROLET'],
    2016: ['CHEVROLET'],
    2017: ['CHEVROLET'],
    2018: ['CHEVROLET'],
    2019: ['CHEVROLET'],
    2020: ['CHEVROLET'],
    2021: ['CHEVROLET'],
    2022: ['CHEVROLET'],
    2023: ['CHEVROLET'],
    2024: ['CHEVROLET'],
    2025: ['CHEVROLET'],
    2026: ['CHEVROLET'],
  },
}

const modelsByBrandAndYear: Record<string, Record<number, string[]>> = {
  DODGE: {
    2018: ['CHALLENGER', 'CHARGER'],
    2019: ['CHALLENGER', 'CHARGER'],
    2020: ['CHALLENGER', 'CHARGER'],
    2021: ['CHALLENGER', 'CHARGER'],
    2022: ['CHALLENGER', 'CHARGER'],
    2023: ['CHALLENGER', 'CHARGER'],
  },

  RAM: {
    2009: ['1500'],
    2010: ['1500'],
    2011: ['1500'],
    2012: ['1500'],
    2013: ['1500'],
    2014: ['1500'],
    2015: ['1500'],
    2016: ['1500'],
    2017: ['1500'],
    2018: ['1500'],
  },

  CHEVROLET: {
    2014: ['CORVETTE'],
    2015: ['CORVETTE'],
    2016: ['CAMARO', 'CORVETTE'],
    2017: ['CAMARO', 'CORVETTE'],
    2018: ['CAMARO', 'CORVETTE'],
    2019: ['CAMARO', 'CORVETTE'],
    2020: ['CAMARO', 'CORVETTE'],
    2021: ['CAMARO', 'CORVETTE'],
    2022: ['CAMARO', 'CORVETTE'],
    2023: ['CAMARO', 'CORVETTE'],
    2024: ['CAMARO', 'CORVETTE'],
    2025: ['CORVETTE'],
    2026: ['CORVETTE'],
  },
}

const versionsByModelAndYear: Record<string, Record<number, string[]>> = {
  CORVETTE: {
    2026: [
      'Stingray 6.2',
      'Z06 5.5',
      'E-Ray 6.2',
      'ZR1 5.5TT',
    ],
  },
}

const moparColors = [
  'B5 Blue',
  'Destroyer Gray',
  'F8 Green',
  'Frostbite',
  'Go Mango',
  'Granite',
  'Octane Red',
  'Pitch Black',
  'Plum Crazy',
  'Sinamon Stick',
  'Sublime',
  'TorRed',
  'Triple Nickel',
  'White Knuckle',
]

const ramColors = [
  'Black',
  'Bright White',
  'Brilliant Black Crystal',
  'Bright Silver Metallic',
  'Deep Cherry Red Crystal',
  'Maximum Steel Metallic',
  'Granite Crystal Metallic',
  'True Blue Pearl',
  'Western Brown',
  'Flame Red',
]

const camaroColors = [
  'Black',
  'Summit White',
  'Red Hot',
  'Riverside Blue',
  'Rapid Blue',
  'Shadow Gray',
  'Sharkskin',
  'Vivid Orange',
  'Wild Cherry',
  'Radiant Red',
  'Panther Matte Black',
]

const corvetteColors = [
  'Accelerate Yellow',
  'Arctic White',
  'Black',
  'Ceramic Matrix Gray',
  'Elkhart Lake Blue',
  'Hypersonic Gray',
  'Rapid Blue',
  'Red Mist',
  'Sea Wolf Gray',
  'Silver Flare',
  'Torch Red',
  'White Pearl',
]

export default function EditRidePage() {
  const params = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [projectCode, setProjectCode] = useState('')
  const [projectName, setProjectName] = useState('')
  const [vin, setVin] = useState('')
  const [plate, setPlate] = useState('')

  const [year, setYear] = useState(2023)
  const [manufacturer, setManufacturer] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [version, setVersion] = useState('')
  const [specialEdition, setSpecialEdition] = useState('None')
  const [color, setColor] = useState('')

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

    setProjectCode(data.project_code || '')
    setProjectName(data.project_name || '')
    setVin(data.vin || '')
    setPlate(data.plate || '')
    setYear(data.year || 2023)
    setManufacturer(data.manufacturer || '')
    setBrand(data.brand || '')
    setModel(data.model || '')
    setVersion(data.version || '')
    setSpecialEdition(data.special_edition || 'None')
    setColor(data.color || '')

    setLoading(false)
  }

  async function updateRide() {
    const { error } = await supabase
      .from('rides')
      .update({
        project_code: projectCode,
        project_name: projectName,
        vin,
        plate,
        year,
        manufacturer,
        brand,
        model,
        version,
        special_edition:
          specialEdition === 'None'
            ? null
            : specialEdition,
        color,
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

  const availableManufacturers =
    manufacturersByYear[year] || []

  const availableBrands =
    brandsByManufacturerAndYear[manufacturer]?.[year] || []

  const availableModels =
    modelsByBrandAndYear[brand]?.[year] || []

  const availableVersions =
    versionsByModelAndYear[model]?.[year] || []

  const availableColors =
    brand === 'RAM'
      ? ramColors
      : model === 'CAMARO'
        ? camaroColors
        : model === 'CORVETTE'
          ? corvetteColors
          : moparColors

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

          <select
            value={year}
            onChange={(e) =>
              setYear(Number(e.target.value))
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {years.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">
            MANUFACTURER
          </label>

          <select
            value={manufacturer}
            onChange={(e) =>
              setManufacturer(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {availableManufacturers.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">
            BRAND
          </label>

          <select
            value={brand}
            onChange={(e) =>
              setBrand(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {availableBrands.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">
            MODEL
          </label>

          <select
            value={model}
            onChange={(e) =>
              setModel(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {availableModels.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">
            VERSION
          </label>

          <select
            value={version}
            onChange={(e) =>
              setVersion(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {availableVersions.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
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

          <select
            value={color}
            onChange={(e) =>
              setColor(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {availableColors.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
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