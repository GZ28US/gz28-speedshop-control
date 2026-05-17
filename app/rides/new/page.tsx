'use client'

import { useState } from 'react'
import Header from '@/components/Header'

const years = [2018, 2019, 2020, 2021, 2022, 2023]

const versionsByYear: Record<number, string[]> = {
  2018: [
    'R/T 5.7 HEMI',
    'R/T SCAT PACK 6.4 HEMI',
    'SRT 392 6.4 HEMI',
    'SRT HELLCAT 6.2 SUPERCHARGED HEMI',
    'SRT HELLCAT WIDEBODY 6.2 SUPERCHARGED HEMI',
    'SRT DEMON 6.2 SUPERCHARGED HEMI',
  ],
  2019: [
    'R/T 5.7 HEMI',
    'R/T SCAT PACK 6.4 HEMI',
    'R/T SCAT PACK WIDEBODY 6.4 HEMI',
    'SRT HELLCAT 6.2 SUPERCHARGED HEMI',
    'SRT HELLCAT WIDEBODY 6.2 SUPERCHARGED HEMI',
    'SRT HELLCAT REDEYE 6.2 SUPERCHARGED HEMI',
  ],
  2020: [
    'R/T 5.7 HEMI',
    'R/T SCAT PACK 6.4 HEMI',
    'R/T SCAT PACK WIDEBODY 6.4 HEMI',
    'SRT HELLCAT 6.2 SUPERCHARGED HEMI',
    'SRT HELLCAT WIDEBODY 6.2 SUPERCHARGED HEMI',
    'SRT HELLCAT REDEYE 6.2 SUPERCHARGED HEMI',
    'SRT SUPER STOCK 6.2 SUPERCHARGED HEMI',
  ],
  2021: [
    'R/T 5.7 HEMI',
    'R/T SCAT PACK 6.4 HEMI',
    'R/T SCAT PACK WIDEBODY 6.4 HEMI',
    'SRT HELLCAT 6.2 SUPERCHARGED HEMI',
    'SRT HELLCAT WIDEBODY 6.2 SUPERCHARGED HEMI',
    'SRT HELLCAT REDEYE 6.2 SUPERCHARGED HEMI',
    'SRT SUPER STOCK 6.2 SUPERCHARGED HEMI',
  ],
  2022: [
    'R/T 5.7 HEMI',
    'R/T SCAT PACK 6.4 HEMI',
    'R/T SCAT PACK WIDEBODY 6.4 HEMI',
    'SRT HELLCAT 6.2 SUPERCHARGED HEMI',
    'SRT HELLCAT WIDEBODY 6.2 SUPERCHARGED HEMI',
    'SRT HELLCAT REDEYE 6.2 SUPERCHARGED HEMI',
    'SRT SUPER STOCK 6.2 SUPERCHARGED HEMI',
  ],
  2023: [
    'R/T 5.7 HEMI',
    'R/T SCAT PACK 6.4 HEMI',
    'R/T SCAT PACK WIDEBODY 6.4 HEMI',
    'SRT HELLCAT 6.2 SUPERCHARGED HEMI',
    'SRT HELLCAT WIDEBODY 6.2 SUPERCHARGED HEMI',
    'SRT HELLCAT REDEYE 6.2 SUPERCHARGED HEMI',
    'SRT SUPER STOCK 6.2 SUPERCHARGED HEMI',
    'SRT DEMON 170 6.2 SUPERCHARGED HEMI',
  ],
}

export default function NewRidePage() {
  const [year, setYear] = useState(2023)
  const manufacturer = 'MOPAR'
  const brand = 'DODGE'
  const model = 'CHALLENGER'
  const [version, setVersion] = useState(versionsByYear[2023][0])

  function changeYear(value: string) {
    const selectedYear = Number(value)
    setYear(selectedYear)
    setVersion(versionsByYear[selectedYear][0])
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
          <option value="MOPAR">MOPAR</option>
        </select>

        <select
          value={brand}
          disabled
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl opacity-100"
        >
          <option value="DODGE">DODGE</option>
        </select>

        <select
          value={model}
          disabled
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl opacity-100"
        >
          <option value="CHALLENGER">CHALLENGER</option>
        </select>

        <select
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        >
          {versionsByYear[year].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold">
          SAVE RIDE
        </button>

        <a href="/rides" className="text-gray-400 text-xl">
          Cancel
        </a>
      </div>
    </main>
  )
}