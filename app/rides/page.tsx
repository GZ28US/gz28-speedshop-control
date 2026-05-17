'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'

type Ride = {
  id: string
  project_code: string
  project_name: string | null
  year: number | null
  manufacturer: string | null
  brand: string | null
  model: string | null
  version: string | null
  special_edition: string | null
  color: string | null
  vin: string | null
  plate: string | null
}

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([])

  useEffect(() => {
    loadRides()
  }, [])

  async function loadRides() {
    const { data } = await supabase
      .from('rides')
      .select('*')
      .order('updated_at', { ascending: false })

    setRides(data || [])
  }

  async function removeRide(id: string) {
    const confirmed = confirm(
      'Are you sure you want to remove this ride/project?'
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('rides')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    loadRides()
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <h2 className="text-4xl font-bold mb-8">
        RIDES
      </h2>

      <a
        href="/rides/new"
        className="inline-block bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold mb-10"
      >
        ADD A NEW RIDE
      </a>

      <div className="space-y-5">
        {rides.length === 0 ? (
          <p className="text-gray-400 text-xl">
            No rides yet.
          </p>
        ) : (
          rides.map((ride) => (
            <div
              key={ride.id}
              className="border border-gray-800 rounded-3xl p-5"
            >
              <h3 className="text-2xl font-bold">
                {ride.project_code} — {ride.project_name || 'No Name'}
              </h3>

              <p className="text-gray-400">
                {ride.year} {ride.brand} {ride.model}
              </p>

              <p className="text-gray-400">
                {ride.version}
              </p>

              {ride.special_edition && (
                <p className="text-gray-400">
                  Special Edition: {ride.special_edition}
                </p>
              )}

              <p className="text-gray-400">
                Color: {ride.color}
              </p>

              <p className="text-gray-400">
                VIN: {ride.vin || '-'}
              </p>

              <p className="text-gray-400 mb-5">
                Plate: {ride.plate || '-'}
              </p>

              <div className="flex gap-3">
                <a
                  href={`/rides/edit/${ride.id}`}
                  className="bg-blue-700 hover:bg-blue-600 px-5 py-3 rounded-2xl font-bold"
                >
                  EDIT
                </a>

                <button
                  onClick={() => removeRide(ride.id)}
                  className="bg-red-700 hover:bg-red-600 px-5 py-3 rounded-2xl font-bold"
                >
                  REMOVE
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}