'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'

const years = [2018, 2019, 2020, 2021, 2022, 2023]

const models = ['CHALLENGER', 'CHARGER']

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
  '2019-CHALLENGER-R/T ScatPack 6.4': [
    'None',
    '1320',
  ],

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

  function changeYear(value: string) {
    setYear(Number(value))
  }

  function changeModel(value: string) {
    setModel(value)
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <h2 className="text-4xl font-bold mb-8">
        ADD A NEW RIDE
      </h2>

      <div className="grid grid-cols-1 gap-5 max-w-2xl">
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

        <select
          value={manufacturer}
          disabled
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl opacity-100"
        >
          <option>MOPAR</option>
        </select>

        <select
          value={brand}
          disabled
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl opacity-100"
        >
          <option>DODGE</option>
        </select>

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

        <button className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold">
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