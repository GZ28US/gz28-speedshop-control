'use client'

import { useState } from 'react'
import Header from '@/components/Header'

const manufacturerOptions = ['MOPAR', 'GM', 'FORD']

const brandOptions: Record<string, string[]> = {
  MOPAR: ['RAM', 'JEEP', 'DODGE', 'CHRYSLER'],
  GM: ['CADILLAC', 'GMC', 'CHEVROLET'],
  FORD: ['FORD'],
}

const modelOptions: Record<string, string[]> = {
  DODGE: ['CHALLENGER', 'CHARGER', 'MAGNUM'],
  RAM: ['1500', '2500', '3500'],
  JEEP: ['GRAND CHEROKEE'],
  CHRYSLER: ['300C'],
  CHEVROLET: ['SUBURBAN', 'TAHOE', 'SILVERADO', 'CORVETTE', 'CAMARO'],
  GMC: ['YUKON', 'SIERRA'],
  CADILLAC: ['ESCALADE', 'CTS'],
  FORD: ['F150', 'MUSTANG'],
}

export default function NewRidePage() {
  const [manufacturer, setManufacturer] = useState('MOPAR')
  const [brand, setBrand] = useState('RAM')
  const [model, setModel] = useState('1500')

  function changeManufacturer(value: string) {
    const firstBrand = brandOptions[value][0]
    const firstModel = modelOptions[firstBrand][0]

    setManufacturer(value)
    setBrand(firstBrand)
    setModel(firstModel)
  }

  function changeBrand(value: string) {
    const firstModel = modelOptions[value][0]

    setBrand(value)
    setModel(firstModel)
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <h2 className="text-4xl font-bold mb-8">
        ADD A NEW RIDE
      </h2>

      <div className="grid grid-cols-1 gap-5 max-w-2xl">
        <select
          value={manufacturer}
          onChange={(e) => changeManufacturer(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        >
          {manufacturerOptions.map((option) => (
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
          {brandOptions[manufacturer].map((option) => (
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
          {modelOptions[brand].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
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