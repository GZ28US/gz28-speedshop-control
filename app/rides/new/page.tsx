'use client'

import { useMemo, useState } from 'react'
import Header from '@/components/Header'

const years = Array.from({ length: 9 }, (_, i) => 2015 + i)

const rideOptions = [
  { year: 2015, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T 5.7 HEMI' },
  { year: 2015, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T SCAT PACK 6.4 HEMI' },
  { year: 2015, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT 392 6.4 HEMI' },
  { year: 2015, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT 6.2 SUPERCHARGED HEMI' },

  { year: 2016, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T 5.7 HEMI' },
  { year: 2016, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T SCAT PACK 6.4 HEMI' },
  { year: 2016, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT 392 6.4 HEMI' },
  { year: 2016, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT 6.2 SUPERCHARGED HEMI' },

  { year: 2017, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T 5.7 HEMI' },
  { year: 2017, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T SCAT PACK 6.4 HEMI' },
  { year: 2017, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT 392 6.4 HEMI' },
  { year: 2017, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT 6.2 SUPERCHARGED HEMI' },

  { year: 2018, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T 5.7 HEMI' },
  { year: 2018, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T SCAT PACK 6.4 HEMI' },
  { year: 2018, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT 392 6.4 HEMI' },
  { year: 2018, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT 6.2 SUPERCHARGED HEMI' },
  { year: 2018, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT WIDEBODY 6.2 SUPERCHARGED HEMI' },
  { year: 2018, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT DEMON 6.2 SUPERCHARGED HEMI' },

  { year: 2019, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T 5.7 HEMI' },
  { year: 2019, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T SCAT PACK 6.4 HEMI' },
  { year: 2019, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T SCAT PACK WIDEBODY 6.4 HEMI' },
  { year: 2019, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT 6.2 SUPERCHARGED HEMI' },
  { year: 2019, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT WIDEBODY 6.2 SUPERCHARGED HEMI' },
  { year: 2019, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT REDEYE 6.2 SUPERCHARGED HEMI' },

  { year: 2020, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T 5.7 HEMI' },
  { year: 2020, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T SCAT PACK 6.4 HEMI' },
  { year: 2020, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T SCAT PACK WIDEBODY 6.4 HEMI' },
  { year: 2020, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT 6.2 SUPERCHARGED HEMI' },
  { year: 2020, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT WIDEBODY 6.2 SUPERCHARGED HEMI' },
  { year: 2020, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT REDEYE 6.2 SUPERCHARGED HEMI' },
  { year: 2020, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT SUPER STOCK 6.2 SUPERCHARGED HEMI' },

  { year: 2021, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T 5.7 HEMI' },
  { year: 2021, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T SCAT PACK 6.4 HEMI' },
  { year: 2021, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T SCAT PACK WIDEBODY 6.4 HEMI' },
  { year: 2021, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT 6.2 SUPERCHARGED HEMI' },
  { year: 2021, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT WIDEBODY 6.2 SUPERCHARGED HEMI' },
  { year: 2021, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT REDEYE 6.2 SUPERCHARGED HEMI' },
  { year: 2021, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT SUPER STOCK 6.2 SUPERCHARGED HEMI' },

  { year: 2022, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T 5.7 HEMI' },
  { year: 2022, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T SCAT PACK 6.4 HEMI' },
  { year: 2022, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T SCAT PACK WIDEBODY 6.4 HEMI' },
  { year: 2022, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT 6.2 SUPERCHARGED HEMI' },
  { year: 2022, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT WIDEBODY 6.2 SUPERCHARGED HEMI' },
  { year: 2022, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT REDEYE 6.2 SUPERCHARGED HEMI' },
  { year: 2022, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT SUPER STOCK 6.2 SUPERCHARGED HEMI' },

  { year: 2023, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T 5.7 HEMI' },
  { year: 2023, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T SCAT PACK 6.4 HEMI' },
  { year: 2023, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'R/T SCAT PACK WIDEBODY 6.4 HEMI' },
  { year: 2023, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT 6.2 SUPERCHARGED HEMI' },
  { year: 2023, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT WIDEBODY 6.2 SUPERCHARGED HEMI' },
  { year: 2023, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT HELLCAT REDEYE 6.2 SUPERCHARGED HEMI' },
  { year: 2023, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT SUPER STOCK 6.2 SUPERCHARGED HEMI' },
  { year: 2023, manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', version: 'SRT DEMON 170 6.2 SUPERCHARGED HEMI' },
]

export default function NewRidePage() {
  const [year, setYear] = useState(2023)
  const [manufacturer, setManufacturer] = useState('MOPAR')
  const [brand, setBrand] = useState('DODGE')
  const [model, setModel] = useState('CHALLENGER')
  const [version, setVersion] = useState('')

  const availableManufacturers = useMemo(() => {
    return Array.from(new Set(rideOptions.filter((o) => o.year === year).map((o) => o.manufacturer)))
  }, [year])

  const availableBrands = useMemo(() => {
    return Array.from(new Set(rideOptions.filter((o) => o.year === year && o.manufacturer === manufacturer).map((o) => o.brand)))
  }, [year, manufacturer])

  const availableModels = useMemo(() => {
    return Array.from(new Set(rideOptions.filter((o) => o.year === year && o.manufacturer === manufacturer && o.brand === brand).map((o) => o.model)))
  }, [year, manufacturer, brand])

  const availableVersions = useMemo(() => {
    return rideOptions
      .filter((o) => o.year === year && o.manufacturer === manufacturer && o.brand === brand && o.model === model)
      .map((o) => o.version)
  }, [year, manufacturer, brand, model])

  function changeYear(value: string) {
    const newYear = Number(value)
    const first = rideOptions.find((o) => o.year === newYear)

    setYear(newYear)
    setManufacturer(first?.manufacturer || '')
    setBrand(first?.brand || '')
    setModel(first?.model || '')
    setVersion(first?.version || '')
  }

  function changeManufacturer(value: string) {
    const first = rideOptions.find((o) => o.year === year && o.manufacturer === value)

    setManufacturer(value)
    setBrand(first?.brand || '')
    setModel(first?.model || '')
    setVersion(first?.version || '')
  }

  function changeBrand(value: string) {
    const first = rideOptions.find((o) => o.year === year && o.manufacturer === manufacturer && o.brand === value)

    setBrand(value)
    setModel(first?.model || '')
    setVersion(first?.version || '')
  }

  function changeModel(value: string) {
    const first = rideOptions.find((o) => o.year === year && o.manufacturer === manufacturer && o.brand === brand && o.model === value)

    setModel(value)
    setVersion(first?.version || '')
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
          onChange={(e) => changeManufacturer(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        >
          {availableManufacturers.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={brand}
          onChange={(e) => changeBrand(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        >
          {availableBrands.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={model}
          onChange={(e) => changeModel(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        >
          {availableModels.map((option) => (
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
          {availableVersions.map((option) => (
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