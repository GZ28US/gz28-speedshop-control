'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

type Ride = {
  id: string
  project_code: string
  project_name: string | null
  year: number | null
  version: string | null
  special_edition: string | null
  color: string | null
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

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setRides(data || [])
    setLoading(false)
  }

  async function removeRide(id: string) {
    const confirmed = confirm(
      'Remove this ride?'
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

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">
          RIDES ({rides.length})
        </h1>

        <Link
          href="/rides/new"
          className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold"
        >
          ADD A NEW RIDE
        </Link>
      </div>

      {loading ? (
        <p className="text-2xl text-gray-400">
          Loading...
        </p>
      ) : rides.length === 0 ? (
        <p className="text-2xl text-gray-400">
          No rides found.
        </p>
      ) : (
        <div className="space-y-5">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex items-center justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold">
                  {ride.project_code} —{' '}
                  {ride.project_name}
                </h2>

                <p className="text-lg text-gray-400">
                  {ride.year} {ride.version}
                </p>

                {ride.special_edition && (
                  <p className="text-lg text-gray-400">
                    {ride.special_edition}
                  </p>
                )}

                <p className="text-lg text-gray-400">
                  {ride.color}
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Link
                  href={`/rides/edit/${ride.id}`}
                  className="bg-blue-700 hover:bg-blue-600 px-5 py-3 rounded-2xl font-bold"
                >
                  EDIT
                </Link>

                <button className="bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-2xl font-bold">
                  INVOICES
                </button>

                <button className="bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-2xl font-bold">
                  GLOBAL BALANCE
                </button>

                <button
                  onClick={() =>
                    removeRide(ride.id)
                  }
                  className="bg-red-700 hover:bg-red-600 px-5 py-3 rounded-2xl font-bold"
                >
                  REMOVE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}