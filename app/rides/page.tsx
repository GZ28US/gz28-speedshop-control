'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

type Ride = {
  id: string
  project_code: string
  project_name: string
  year: number
  manufacturer: string
  brand: string
  model: string
  version: string
  special_edition: string | null
  color: string
  vin: string
  plate: string
  created_at: string
  updated_at: string
}

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRides()
  }, [])

  async function loadRides() {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .order('updated_at', {
        ascending: false,
      })
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      console.error(error)
      return
    }

    setRides(data || [])
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">
          RIDES
        </h1>

        <Link
          href="/rides/new"
          className="bg-green-700 hover:bg-green-600 px-6 py-3 rounded-2xl text-xl font-bold"
        >
          + NEW RIDE
        </Link>
      </div>

      {loading ? (
        <p className="text-2xl">
          Loading rides...
        </p>
      ) : rides.length === 0 ? (
        <p className="text-2xl text-gray-400">
          No rides enrolled yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rides.map((ride) => (
            <Link
              key={ride.id}
              href={`/rides/${ride.id}`}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-green-600 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {ride.project_code}
                  </h2>

                  <p className="text-lg text-gray-400">
                    {ride.project_name}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-lg">
                <p>
                  <span className="font-bold">
                    YEAR:
                  </span>{' '}
                  {ride.year}
                </p>

                <p>
                  <span className="font-bold">
                    MANUFACTURER:
                  </span>{' '}
                  {ride.manufacturer}
                </p>

                <p>
                  <span className="font-bold">
                    BRAND:
                  </span>{' '}
                  {ride.brand}
                </p>

                <p>
                  <span className="font-bold">
                    MODEL:
                  </span>{' '}
                  {ride.model}
                </p>

                <p>
                  <span className="font-bold">
                    VERSION:
                  </span>{' '}
                  {ride.version}
                </p>

                {ride.special_edition && (
                  <p>
                    <span className="font-bold">
                      SPECIAL EDITION:
                    </span>{' '}
                    {ride.special_edition}
                  </p>
                )}

                <p>
                  <span className="font-bold">
                    COLOR:
                  </span>{' '}
                  {ride.color}
                </p>

                <p>
                  <span className="font-bold">
                    VIN:
                  </span>{' '}
                  {ride.vin}
                </p>

                <p>
                  <span className="font-bold">
                    PLATE:
                  </span>{' '}
                  {ride.plate}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}