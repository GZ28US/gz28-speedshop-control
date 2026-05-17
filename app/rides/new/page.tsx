'use client'

import { useMemo, useState } from 'react'
import Header from '@/components/Header'

const years = Array.from({ length: 13 }, (_, i) => 2015 + i)

const manufacturers = ['MOPAR', 'GM', 'FORD']

type RideOption = {
  manufacturer: string
  brand: string
  model: string
  startYear: number
  endYear: number
}

const rideOptions: RideOption[] = [
  { manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHALLENGER', startYear: 2015, endYear: 2023 },
  { manufacturer: 'MOPAR', brand: 'DODGE', model: 'CHARGER', startYear: 2015, endYear: 2023 },
  { manufacturer: 'MOPAR', brand: 'DODGE', model: 'DURANGO', startYear: 2015, endYear: 2027 },
  { manufacturer: 'MOPAR', brand: 'DODGE', model: 'VIPER', startYear: 2015, endYear: 2017 },

  { manufacturer: 'MOPAR', brand: 'CHRYSLER', model: '300', startYear: 2015, endYear: 2023 },

  { manufacturer: 'MOPAR', brand: 'JEEP', model: 'GRAND CHEROKEE', startYear: 2015, endYear: 2022 },
  { manufacturer: 'MOPAR', brand: 'JEEP', model: 'WRANGLER 392', startYear: 2021, endYear: 2025 },
  { manufacturer: 'MOPAR', brand: 'JEEP', model: 'WAGONEER', startYear: 2022, endYear: 2023 },
  { manufacturer: 'MOPAR', brand: 'JEEP', model: 'GRAND WAGONEER', startYear: 2022, endYear: 2023 },

  { manufacturer: 'MOPAR', brand: 'RAM', model: '1500', startYear: 2015, endYear: 2024 },
  { manufacturer: 'MOPAR', brand: 'RAM', model: '1500 HEMI RETURN', startYear: 2026, endYear: 2027 },
  { manufacturer: 'MOPAR', brand: 'RAM', model: '1500 TRX', startYear: 2021, endYear: 2024 },
  { manufacturer: 'MOPAR', brand: 'RAM', model: '2500', startYear: 2015, endYear: 2027 },
  { manufacturer: 'MOPAR', brand: 'RAM', model: '3500', startYear: 2015, endYear: 2027 },

  { manufacturer: 'GM', brand: 'CHEVROLET', model: 'CAMARO', startYear: 2015, endYear: 2024 },
  { manufacturer: 'GM', brand: 'CHEVROLET', model: 'CORVETTE', startYear: 2015, endYear: 2027 },
  { manufacturer: 'GM', brand: 'CHEVROLET', model: 'SILVERADO 1500', startYear: 2015, endYear: 2027 },
  { manufacturer: 'GM', brand: 'CHEVROLET', model: 'SILVERADO 2500', startYear: 2015, endYear: 2027 },
  { manufacturer: 'GM', brand: 'CHEVROLET', model: 'SILVERADO 3500', startYear: 2015, endYear: 2027 },
  { manufacturer: 'GM', brand: 'CHEVROLET', model: 'SUBURBAN', startYear: 2015, endYear: 2027 },
  { manufacturer: 'GM', brand: 'CHEVROLET', model: 'TAHOE', startYear: 2015, endYear: 2027 },
  { manufacturer: 'GM', brand: 'CHEVROLET', model: 'SS', startYear: 2015, endYear: 2017 },

  { manufacturer: 'GM', brand: 'GMC', model: 'SIERRA 1500', startYear: 2015, endYear: 2027 },
  { manufacturer: 'GM', brand: 'GMC', model: 'SIERRA 2500', startYear: 2015, endYear: 2027 },
  { manufacturer: 'GM', brand: 'GMC', model: 'SIERRA 3500', startYear: 2015, endYear: 2027 },
  { manufacturer: 'GM', brand: 'GMC', model: 'YUKON', startYear: 2015, endYear: 2027 },
  { manufacturer: 'GM', brand: 'GMC', model: 'YUKON XL', startYear: 2015, endYear: 2027 },

  { manufacturer: 'GM', brand: 'CADILLAC', model: 'CTS-V', startYear: 2015, endYear: 2019 },
  { manufacturer: 'GM', brand: 'CADILLAC', model: 'CT5-V BLACKWING', startYear: 2022, endYear: 2027 },
  { manufacturer: 'GM', brand: 'CADILLAC', model: 'ESCALADE', startYear: 2015, endYear: 2027 },
  { manufacturer: 'GM', brand: 'CADILLAC', model: 'ESCALADE-V', startYear: 2023, endYear: 2027 },

  { manufacturer: 'FORD', brand: 'FORD', model: 'MUSTANG', startYear: 2015, endYear: 2027 },
  { manufacturer: 'FORD', brand: 'FORD', model: 'F-150', startYear: 2015, endYear: 2027 },
  { manufacturer: 'FORD', brand: 'FORD', model: 'F-150 RAPTOR R', startYear: 2023, endYear: 2027 },
  { manufacturer: 'FORD', brand: 'FORD', model: 'F-250 SUPER DUTY', startYear: 2015, endYear: 2027 },
  { manufacturer: 'FORD', brand: 'FORD', model: 'F-350 SUPER DUTY', startYear: 2015, endYear: 2027 },
  { manufacturer: 'FORD', brand: 'FORD', model: 'F-450 SUPER DUTY', startYear: 2015, endYear: 2027 },
  { manufacturer: 'FORD', brand: 'FORD', model: 'EXPEDITION', startYear: 2015, endYear: 2027 },
]

export default function NewRidePage() {
  const [year, setYear] = useState(2026)
  const [manufacturer, setManufacturer] = useState('MOPAR')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')

  const availableOptions = useMemo(() => {
    return rideOptions.filter(
      (option) =>
        option.manufacturer === manufacturer &&
        year >= option.startYear &&
        year <= option.endYear
    )
  }, [year, manufacturer])

  const availableBrands = useMemo(() => {
    return Array.from(new Set(availableOptions.map((option) => option.brand)))
  }, [availableOptions])

  const availableModels = useMemo(() => {
    return availableOptions
      .filter((option) => option.brand === brand)
      .map((option) => option.model)
  }, [availableOptions, brand])

  function changeYear(value: string) {
    const newYear = Number(value)
    const options = rideOptions.filter(
      (option) =>
        option.manufacturer === manufacturer &&
        newYear >= option.startYear &&
        newYear <= option.endYear
    )

    const firstBrand = options[0]?.brand || ''
    const firstModel = options.find((option) => option.brand === firstBrand)?.model || ''

    setYear(newYear)
    setBrand(firstBrand)
    setModel(firstModel)
  }

  function changeManufacturer(value: string) {
    const options = rideOptions.filter(
      (option) =>
        option.manufacturer === value &&
        year >= option.startYear &&
        year <= option.endYear
    )

    const firstBrand = options[0]?.brand || ''
    const firstModel = options.find((option) => option.brand === firstBrand)?.model || ''

    setManufacturer(value)
    setBrand(firstBrand)
    setModel(firstModel)
  }

  function changeBrand(value: string) {
    const firstModel =
      availableOptions.find((option) => option.brand === value)?.model || ''

    setBrand(value)
    setModel(firstModel)
  }

  useMemo(() => {
    if (!brand && availableBrands.length > 0) {
      setBrand(availableBrands[0])
      setModel(
        availableOptions.find((option) => option.brand === availableBrands[0])?.model || ''
      )
    }
  }, [brand, availableBrands, availableOptions])

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
          {manufacturers.map((option) => (
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
          onChange={(e) => setModel(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        >
          {availableModels.map((option) => (
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