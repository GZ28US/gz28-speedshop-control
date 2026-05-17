'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

const years = [2018, 2019, 2020, 2021, 2022, 2023]

const models = ['CHALLENGER', 'CHARGER']

const versionsByModelAndYear: Record<string, Record<number, string[]>> = {
  CHALLENGER: {
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
  const [year, setYear] = useState(2023)

  const manufacturer = 'MOPAR'
  const brand = 'DODGE'

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

  const [entryDate, setEntryDate] = useState('')
  const [vin, setVin] = useState('')
  const [plate, setPlate] = useState('')
  const [performancePackage, setPerformancePackage] = useState('')
  const [projectCode, setProjectCode] = useState('US.0001')

  useEffect(() => {
    async function loadNextProjectCode() {
      const { data } = await supabase
        .from('rides')
        .select('project_code')
        .order('project_code', { ascending: false })
        .limit(1)

      if (data && data.length > 0) {
        const lastCode = data[0].project_code
        const number = Number(lastCode.replace('US.', ''))
        const nextNumber = number + 1

        setProjectCode(
          `US.${String(nextNumber).padStart(4, '0')}`
        )
      }
    }

    loadNextProjectCode()
  }, [])

  useEffect(() => {
    setVersion(
      versionsByModelAndYear[model][year][0]
    )
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

  function changeYear(value: string) {
    setYear(Number(value))
  }

  function changeModel(value: string) {
    setModel(value)
  }

  async function saveRide() {
    const { error } = await supabase
      .from('rides')
      .insert([
        {
          project_code: projectCode,
          entry_date: entryDate,
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
          performance_package: performancePackage,
        },
      ])

    if (error) {
      alert(error.message)
      return
    }

    alert('Ride saved successfully!')
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <h2 className="text-4xl font-bold mb-8">
        ADD A NEW RIDE
      </h2>

      <div className="grid grid-cols-1 gap-5 max-w-2xl">
        <input
          type="text"
          value={projectCode}
          disabled
          className="bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        />

        <input
          type="date"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        />

        <select
          value={year}
          onChange={(e) => changeYear(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        >
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={manufacturer}
          disabled
          className="bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        />

        <input
          type="text"
          value={brand}
          disabled
          className="bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        />

        <select
          value={model}
          onChange={(e) => changeModel(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        >
          {models.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        >
          {versionsByModelAndYear[model][year].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {availableSpecialEditions.length > 0 && (
          <select
            value={specialEdition}
            onChange={(e) => setSpecialEdition(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
          >
            {availableSpecialEditions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        >
          {availableColors.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="VIN"
          value={vin}
          onChange={(e) =>
            setVin(
              e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
            )
          }
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        />

        <input
          type="text"
          placeholder="PLATE"
          value={plate}
          onChange={(e) =>
            setPlate(
              e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
            )
          }
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        />

        <input
          type="text"
          placeholder="PERFORMANCE PACKAGE"
          value={performancePackage}
          onChange={(e) =>
            setPerformancePackage(e.target.value)
          }
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        />

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