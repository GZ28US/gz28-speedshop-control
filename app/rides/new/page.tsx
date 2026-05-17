'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

type Client = {
  id: string
  name: string
}

const years = [
  2016,
  2017,
  2018,
  2019,
  2020,
  2021,
  2022,
  2023,
]

const manufacturers = [
  'MOPAR',
  'GM',
]

const brandsByManufacturer: Record<string, string[]> = {
  MOPAR: ['DODGE'],
  GM: ['CHEVROLET'],
}

const modelsByBrand: Record<string, string[]> = {
  DODGE: ['CHALLENGER', 'CHARGER'],
  CHEVROLET: ['CAMARO'],
}

const versionsByModelAndYear: Record<
  string,
  Record<number, string[]>
> = {
  CHALLENGER: {
    2018: [
      'R/T 5.7',
      'R/T ScatPack 6.4',
      'SRT 392 6.4',
      'SRT HellCat 6.2',
      'SRT HellCat WideBody 6.2',
      'SRT Demon 6.2',
    ],

    2019: [
      'R/T 5.7',
      'R/T ScatPack 6.4',
      'R/T ScatPack WideBody 6.4',
      'SRT HellCat 6.2',
      'SRT HellCat WideBody 6.2',
      'SRT HellCat RedEye 6.2',
      'SRT HellCat RedEye WideBody 6.2',
    ],

    2020: [
      'R/T 5.7',
      'R/T ScatPack 6.4',
      'R/T ScatPack WideBody 6.4',
      'SRT HellCat 6.2',
      'SRT HellCat WideBody 6.2',
      'SRT HellCat RedEye 6.2',
      'SRT HellCat RedEye WideBody 6.2',
      'SRT HellCat RedEye SuperStock 6.2',
    ],

    2021: [
      'R/T 5.7',
      'R/T ScatPack 6.4',
      'R/T ScatPack WideBody 6.4',
      'SRT HellCat 6.2',
      'SRT HellCat WideBody 6.2',
      'SRT HellCat RedEye 6.2',
      'SRT HellCat RedEye WideBody 6.2',
      'SRT HellCat RedEye SuperStock 6.2',
    ],

    2022: [
      'R/T 5.7',
      'R/T ScatPack 6.4',
      'R/T ScatPack WideBody 6.4',
      'SRT HellCat 6.2',
      'SRT HellCat WideBody 6.2',
      'SRT HellCat RedEye 6.2',
      'SRT HellCat RedEye WideBody 6.2',
      'SRT HellCat RedEye SuperStock 6.2',
    ],

    2023: [
      'R/T 5.7',
      'R/T ScatPack 6.4',
      'R/T ScatPack WideBody 6.4',
      'SRT HellCat 6.2',
      'SRT HellCat WideBody 6.2',
      'SRT HellCat RedEye 6.2',
      'SRT HellCat RedEye WideBody 6.2',
      'SRT HellCat RedEye SuperStock 6.2',
      'SRT Demon 170 6.2',
    ],
  },

  CHARGER: {
    2018: [
      'R/T 5.7',
      'ScatPack 6.4',
      'SRT 392 6.4',
      'SRT HellCat 6.2',
    ],

    2019: [
      'R/T 5.7',
      'ScatPack 6.4',
      'ScatPack WideBody 6.4',
      'SRT HellCat 6.2',
      'SRT HellCat RedEye 6.2',
      'SRT HellCat RedEye WideBody 6.2',
    ],

    2020: [
      'R/T 5.7',
      'ScatPack 6.4',
      'ScatPack WideBody 6.4',
      'SRT HellCat 6.2',
      'SRT HellCat WideBody 6.2',
      'SRT HellCat RedEye 6.2',
      'SRT HellCat RedEye WideBody 6.2',
    ],

    2021: [
      'R/T 5.7',
      'ScatPack 6.4',
      'ScatPack WideBody 6.4',
      'SRT HellCat 6.2',
      'SRT HellCat WideBody 6.2',
      'SRT HellCat RedEye 6.2',
      'SRT HellCat RedEye WideBody 6.2',
    ],

    2022: [
      'R/T 5.7',
      'ScatPack 6.4',
      'ScatPack WideBody 6.4',
      'SRT HellCat 6.2',
      'SRT HellCat WideBody 6.2',
      'SRT HellCat RedEye 6.2',
      'SRT HellCat RedEye WideBody 6.2',
    ],

    2023: [
      'R/T 5.7',
      'ScatPack 6.4',
      'ScatPack WideBody 6.4',
      'SRT HellCat 6.2',
      'SRT HellCat WideBody 6.2',
      'SRT HellCat RedEye 6.2',
      'SRT HellCat RedEye WideBody 6.2',
    ],
  },

  CAMARO: {
    2016: [
      'SS 6.2',
      'SS 1LE 6.2',
      'ZL1 6.2',
    ],

    2017: [
      'SS 6.2',
      'SS 1LE 6.2',
      'ZL1 6.2',
      'ZL1 1LE 6.2',
    ],

    2018: [
      'SS 6.2',
      'SS 1LE 6.2',
      'ZL1 6.2',
      'ZL1 1LE 6.2',
    ],

    2019: [
      'LT1 6.2',
      'SS 6.2',
      'SS 1LE 6.2',
      'ZL1 6.2',
      'ZL1 1LE 6.2',
    ],

    2020: [
      'LT1 6.2',
      'SS 6.2',
      'SS 1LE 6.2',
      'ZL1 6.2',
      'ZL1 1LE 6.2',
    ],

    2021: [
      'LT1 6.2',
      'SS 6.2',
      'SS 1LE 6.2',
      'ZL1 6.2',
      'ZL1 1LE 6.2',
    ],

    2022: [
      'LT1 6.2',
      'SS 6.2',
      'SS 1LE 6.2',
      'ZL1 6.2',
      'ZL1 1LE 6.2',
    ],

    2023: [
      'LT1 6.2',
      'SS 6.2',
      'SS 1LE 6.2',
      'ZL1 6.2',
      'ZL1 1LE 6.2',
      'Collector Edition ZL1 6.2',
    ],
  },
}

const defaultColors = [
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
]

export default function NewRidePage() {
  const router = useRouter()

  const [clients, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState('')

  const [projectCode, setProjectCode] = useState('US.000')
  const [projectName, setProjectName] = useState('')

  const [vin, setVin] = useState('')
  const [plate, setPlate] = useState('')

  const [year, setYear] = useState(2023)

  const [manufacturer, setManufacturer] =
    useState('MOPAR')

  const [brand, setBrand] =
    useState('DODGE')

  const [model, setModel] =
    useState('CHALLENGER')

  const [version, setVersion] = useState(
    versionsByModelAndYear.CHALLENGER[2023][0]
  )

  const [specialEdition, setSpecialEdition] =
    useState('None')

  const [color, setColor] = useState(
    defaultColors[0]
  )

  useEffect(() => {
    loadClients()
    loadNextProjectCode()
  }, [])

  async function loadClients() {
    const { data } = await supabase
      .from('clients')
      .select('id, name')
      .order('name', { ascending: true })

    setClients(data || [])

    if (data && data.length > 0) {
      setClientId(data[0].id)
    }
  }

  async function loadNextProjectCode() {
    const { data } = await supabase
      .from('rides')
      .select('project_code')

    const usedNumbers =
      data?.map((item) => {
        const match =
          item.project_code?.match(/US\.(\d+)/)

        return match
          ? Number(match[1])
          : null
      }) || []

    let nextNumber = 0

    while (
      usedNumbers.includes(nextNumber)
    ) {
      nextNumber++
    }

    setProjectCode(
      `US.${String(nextNumber).padStart(3, '0')}`
    )
  }

  useEffect(() => {
    const firstBrand =
      brandsByManufacturer[manufacturer][0]

    setBrand(firstBrand)
  }, [manufacturer])

  useEffect(() => {
    const firstModel =
      modelsByBrand[brand][0]

    setModel(firstModel)
  }, [brand])

  useEffect(() => {
    const availableVersions =
      versionsByModelAndYear[model]?.[year]

    if (
      availableVersions &&
      availableVersions.length > 0
    ) {
      setVersion(availableVersions[0])
    }
  }, [year, model])

  useEffect(() => {
    if (model === 'CAMARO') {
      setColor(camaroColors[0])
    } else {
      setColor(defaultColors[0])
    }
  }, [model])

  async function saveRide() {
    const { error } = await supabase
      .from('rides')
      .insert([
        {
          client_id: clientId || null,
          project_code: projectCode,
          project_name: projectName,
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

  const availableVersions =
    versionsByModelAndYear[model]?.[year] || []

  const availableColors =
    model === 'CAMARO'
      ? camaroColors
      : defaultColors

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <h2 className="text-4xl font-bold mb-8">
        ADD A NEW RIDE
      </h2>

      <div className="grid grid-cols-1 gap-5 max-w-2xl">
        <div>
          <label className="block mb-2 text-lg font-bold">
            CLIENT
          </label>

          <select
            value={clientId}
            onChange={(e) =>
              setClientId(e.target.value)
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {clients.map((client) => (
              <option
                key={client.id}
                value={client.id}
              >
                {client.name}
              </option>
            ))}
          </select>
        </div>

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
            {manufacturers.map((option) => (
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
            {brandsByManufacturer[
              manufacturer
            ].map((option) => (
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
            {modelsByBrand[brand].map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              )
            )}
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
            {availableVersions.map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              )
            )}
          </select>
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
            {availableColors.map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              )
            )}
          </select>
        </div>

        <button
          onClick={saveRide}
          className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold"
        >
          SAVE RIDE
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