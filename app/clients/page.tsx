'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

type Client = {
  id: string
  name: string
  email: string | null
  country: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
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
      .order('name', { ascending: true })

    setClients(data || [])
  }

  async function removeClient(id: string) {
    const confirmed = confirm('Are you sure you want to remove this client?')
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
      <Header />

      <h2 className="text-4xl font-bold mb-8">
        CLIENTS ({clients.length})
      </h2>

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
              className="border border-gray-800 rounded-3xl p-5 flex items-center justify-between gap-5"
            >
              <div>
                <h3 className="text-2xl font-bold">
                  {client.name}
                </h3>

                <p className="text-gray-400">
                  {client.email || '-'}
                </p>

                <p className="text-gray-400">
                  {client.phone || '-'}
                </p>

                <p className="text-gray-400">
                  {client.city || '-'}, {client.state || '-'} {client.zip || ''}
                </p>
              </div>

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