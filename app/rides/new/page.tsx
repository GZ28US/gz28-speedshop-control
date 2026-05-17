'use client'

import { useState } from 'react'
import Header from '@/components/Header'

const years = Array.from({ length: 13 }, (_, i) => String(2015 + i))

const manufacturers = ['MOPAR', 'GM', 'FORD']

const modelsByManufacturer: Record<string, string[]> = {
  MOPAR: [
    'DODGE CHALLENGER',
    'DODGE CHARGER',
    'DODGE DURANGO',
    'DODGE VIPER',
    'CHRYSLER 300',
    'JEEP GRAND CHEROKEE',
    'JEEP WRANGLER 392',
    'JEEP WAGONEER',
    'JEEP GRAND WAGONEER',
    'RAM 1500',
    'RAM 2500',
    'RAM 3500',
  ],
  GM: [
    'CHEVROLET CAMARO',
    'CHEVROLET CORVETTE',
    'CHEVROLET SILVERADO 1500',
    'CHEVROLET SILVERADO 2500',
    'CHEVROLET SILVERADO 3500',
    'CHEVROLET SUBURBAN',
    'CHEVROLET TAHOE',
    'CHEVROLET SS',
    'GMC SIERRA 1500',
    'GMC SIERRA 2500',
    'GMC SIERRA 3500',
    'GMC YUKON',
    'GMC YUKON XL',
    'CADILLAC CTS-V',
    'CADILLAC CT5-V BLACKWING',
    'CADILLAC ESCALADE',
    'CADILLAC ESCALADE-V',
  ],
  FORD: [
    'FORD MUSTANG',
    'FORD F-150',
    'FORD F-150 RAPTOR R',
    'FORD F-250 SUPER DUTY',
    'FORD F-350 SUPER DUTY',
    'FORD F-450 SUPER DUTY',
    'FORD EXPEDITION',
    'FORD E-SERIES',
  ],
}

export default function NewRidePage() {
  const [year, setYear] = useState('2026')
  const [manufacturer, setManufacturer] = useState('MOPAR')
  const [model, setModel] = useState(modelsByManufacturer.MOPAR[0])

  function changeManufacturer(value: string) {
    setManufacturer(value)
    setModel(modelsByManufacturer[value][0])
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
          onChange={(e) => setYear(e.target.value)}
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
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        >
          {modelsByManufacturer[manufacturer].map((option) => (
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