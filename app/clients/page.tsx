'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Client = {
  id: string
  name: string
  email: string | null
  phone: string | null
  city: string | null
  state: string | null
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    loadClients()
  }, [])

  async function loadClients() {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    setClients(data || [])
  }

  async function removeClient(id: string) {
    const confirmed = confirm(
      'Are you sure you want to remove this client?'
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    loadClients()
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-5xl font-bold mb-10">
        CLIENTS
      </h1>

      <a
        href="/clients/new"
        className="inline-block bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold mb-10"
      >
        ADD A NEW CLIENT
      </a>

      <div className="space-y-5">
        {clients.length === 0 ? (
          <p className="text-gray-400 text-xl">
            No clients yet.
          </p>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              className="border border-gray-800 rounded-3xl p-5"
            >
              <h2 className="text-2xl font-bold">
                {client.name}
              </h2>

              <p className="text-gray-400">
                {client.email}
              </p>

              <p className="text-gray-400">
                {client.phone}
              </p>

              <p className="text-gray-400 mb-5">
                {client.city} {client.state}
              </p>

              <div className="flex gap-3">
                <a
                  href={`/clients/edit/${client.id}`}
                  className="bg-blue-700 hover:bg-blue-600 px-5 py-3 rounded-2xl font-bold"
                >
                  EDIT
                </a>

                <button
                  onClick={() => removeClient(client.id)}
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