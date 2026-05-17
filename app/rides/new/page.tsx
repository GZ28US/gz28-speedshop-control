'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

type Client = {
  id: string
  name: string
}

const years = [2018, 2019, 2020, 2021, 2022, 2023]

const manufacturers = ['MOPAR']

const brandsByManufacturer: Record<string, string[]> = {
  MOPAR: ['DODGE'],
}

const modelsByBrand: Record<string, string[]> = {
  DODGE: ['CHALLENGER', 'CHARGER'],
}

const versionsByModelAndYear: Record<string, Record<number, string[]>> = {
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
}

const specialEditions: Record<string, string[]> = {
  '2019-CHALLENGER-R/T ScatPack 6.4': ['None', '1320'],

  '2023-CHALLENGER-R/T ScatPack 6.4': [
    'None',
    'Swinger',
    'Shakedown',
    'Mopar Edition',
    'T/A',
    'Shaker',
  ],

  '2023-CHALLENGER-R/T ScatPack WideBody 6.4': [
    'None',
    'Swinger',
    'Shakedown',
    'Mopar Edition',
    'T/A',
    'Shaker',
  ],

  '2023-CHALLENGER-SRT HellCat 6.2': [
    'None',
    'Black Ghost',
    'Jailbreak',
  ],

  '2023-CHALLENGER-SRT HellCat WideBody 6.2': [
    'None',
    'Black Ghost',
    'Jailbreak',
  ],

  '2023-CHALLENGER-SRT HellCat RedEye 6.2': [
    'None',
    'Jailbreak',
  ],

  '2023-CHALLENGER-SRT HellCat RedEye WideBody 6.2': [
    'None',
    'Jailbreak',
  ],

  '2023-CHARGER-ScatPack 6.4': [
    'None',
    'Super Bee',
  ],

  '2023-CHARGER-ScatPack WideBody 6.4': [
    'None',
    'Super Bee',
  ],

  '2023-CHARGER-SRT HellCat RedEye 6.2': [
    'None',
    'King Daytona',
    'Daytona',
    'Jailbreak',
  ],

  '2023-CHARGER-SRT HellCat RedEye WideBody 6.2': [
    'None',
    'King Daytona',
    'Daytona',
    'Jailbreak',
  ],
}

const colorsByConfiguration: Record<string, string[]> = {
  '2023-CHALLENGER-R/T ScatPack 6.4-Swinger': [
    'Sublime',
    'F8 Green',
    'White Knuckle',
  ],

  '2023-CHALLENGER-R/T ScatPack WideBody 6.4-Swinger': [
    'Sublime',
    'F8 Green',
    'White Knuckle',
  ],

  '2023-CHARGER-SRT HellCat RedEye 6.2-King Daytona': [
    'Go Mango',
  ],

  '2023-CHARGER-SRT HellCat RedEye WideBody 6.2-King Daytona': [
    'Go Mango',
  ],

  default: [
    'Pitch Black',
    'White Knuckle',
    'Destroyer Grey',
    'Go Mango',
    'TorRed',
    'Plum Crazy',
    'F8 Green',
    'Sublime',
    'B5 Blue',
    'Smoke Show',
  ],
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

  const [version, setVersion] = useState(
    versionsByModelAndYear.CHALLENGER[2023][0]
  )

  const specialEditionKey = `${year}-${model}-${version}`
  const availableSpecialEditions = specialEditions[specialEditionKey] || []

  const [specialEdition, setSpecialEdition] = useState('None')

  const colorKey = `${year}-${model}-${version}-${specialEdition}`

  const availableColors =
    colorsByConfiguration[colorKey] ||
    colorsByConfiguration.default

  const [color, setColor] = useState(availableColors[0])

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
        const match = item.project_code?.match(/US\.(\d+)/)

        return match ? Number(match[1]) : null
      }) || []

    let nextNumber = 0

    while (usedNumbers.includes(nextNumber)) {
      nextNumber++
    }

    setProjectCode(`US.${String(nextNumber).padStart(3, '0')}`)
  }

  useEffect(() => {
    const firstBrand = brandsByManufacturer[manufacturer][0]
    setBrand(firstBrand)
  }, [manufacturer])

  useEffect(() => {
    const firstModel = modelsByBrand[brand][0]
    setModel(firstModel)
  }, [brand])

  useEffect(() => {
    setVersion(versionsByModelAndYear[model][year][0])
  }, [year, model])

  useEffect(() => {
    const key = `${year}-${model}-${version}`
    const options = specialEditions[key] || []

    setSpecialEdition(options[0] || 'None')
  }, [year, model, version])

  useEffect(() => {
    const key = `${year}-${model}-${version}-${specialEdition}`

    const colors =
      colorsByConfiguration[key] ||
      colorsByConfiguration.default

    setColor(colors[0])
  }, [year, model, version, specialEdition])

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

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <h2 className="text-4xl font-bold mb-8">
        ADD A NEW RIDE
      </h2>

      <div className="grid grid-cols-1 gap-5 max-w-2xl">
        <div>
          <label className="block mb-2 text-lg font-bold">CLIENT</label>

          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">PROJECT CODE</label>

          <input
            type="text"
            value={projectCode}
            onChange={(e) => setProjectCode(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">PROJECT NAME</label>

          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">VIN</label>

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
          <label className="block mb-2 text-lg font-bold">PLATE</label>

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
          <label className="block mb-2 text-lg font-bold">YEAR</label>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">MANUFACTURER</label>

          <select
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {manufacturers.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">BRAND</label>

          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {brandsByManufacturer[manufacturer].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">MODEL</label>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {modelsByBrand[brand].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">VERSION</label>

          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {versionsByModelAndYear[model][year].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {availableSpecialEditions.length > 0 && (
          <div>
            <label className="block mb-2 text-lg font-bold">
              SPECIAL EDITION
            </label>

            <select
              value={specialEdition}
              onChange={(e) => setSpecialEdition(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
            >
              {availableSpecialEditions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block mb-2 text-lg font-bold">COLOR</label>

          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {availableColors.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={saveRide}
          className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold"
        >
          SAVE RIDE
        </button>

        <a href="/rides" className="text-gray-400 text-xl">
          Cancel
        </a>
      </div>
    </main>
  )
}