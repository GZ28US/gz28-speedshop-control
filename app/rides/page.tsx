'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'

type Ride = {
  id: string
  name: string
  code: string | null
}

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([])

  useEffect(() => {
    loadRides()
  }, [])

  async function loadRides() {
    const { data } = await supabase
      .from('categories')
      .select('id, name, code')
      .eq('type', 'expense')
      .ilike('name', 'US.%')
      .order('code', { ascending: true })

    setRides(data || [])
  }

  async function removeRide(id: string) {
    const confirmed = confirm(
      'Are you sure you want to remove this ride/project?'
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('categories')
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
                {ride.name}
              </h3>

              <p className="text-gray-400 mb-5">
                {ride.code}
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