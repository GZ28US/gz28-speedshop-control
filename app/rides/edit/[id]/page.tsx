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
  created_at: string | null
  updated_at: string | null
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
      alert(error.message)
      setLoading(false)
      return
    }

    setRides(data || [])
    setLoading(false)
  }

  async function removeRide(id: string) {
    const confirmed = confirm(
      'Are you sure you want to remove this ride?'
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
        <h2 className="text-4xl font-bold">
          RIDES ({rides.length})
        </h2>

        <Link
          href="/rides/new"
          className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold"
        >
          ADD A NEW RIDE
        </Link>
      </div>

      {loading ? (
        <p className="text-xl text-gray-400">
          Loading rides...
        </p>
      ) : rides.length === 0 ? (
        <p className="text-xl text-gray-400">
          No rides enrolled yet.
        </p>
      ) : (
        <div className="space-y-5">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="border border-gray-800 rounded-3xl p-5 flex items-center justify-between gap-5"
            >
              <div>
                <h3 className="text-2xl font-bold">
                  {ride.project_code} —{' '}
                  {ride.project_name || 'No Name'}
                </h3>

                <p className="text-gray-400 text-lg">
                  {ride.year} {ride.version}
                </p>

                {ride.special_edition && (
                  <p className="text-gray-400 text-lg">
                    Special Edition:{' '}
                    {ride.special_edition}
                  </p>
                )}

                <p className="text-gray-400 text-lg">
                  Color: {ride.color || '-'}
                </p>
              </div>

              <div className="flex gap-3 flex-wrap justify-end">
                <Link
                  href={`/rides/edit/${ride.id}`}
                  className="bg-blue-700 hover:bg-blue-600 px-5 py-3 rounded-2xl font-bold"
                >
                  EDIT
                </Link>

                <button className="bg-gray-800 hover:bg-gray-700 px-5 py-3 rounded-2xl font-bold">
                  INVOICES
                </button>

                <button className="bg-gray-800 hover:bg-gray-700 px-5 py-3 rounded-2xl font-bold">
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