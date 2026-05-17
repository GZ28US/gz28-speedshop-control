'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function NewClientPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  })

  async function saveClient() {
    if (!form.name.trim()) {
      alert('NAME is required')
      return
    }

    const { error } = await supabase
      .from('clients')
      .insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
      })

    if (error) {
      alert(error.message)
      return
    }

    window.location.href = '/clients'
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-5xl font-bold mb-10">
        ADD A NEW CLIENT
      </h1>

      <div className="grid grid-cols-1 gap-5 max-w-2xl">
        <input
          placeholder="NAME"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        />

        <input
          placeholder="EMAIL"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        />

        <input
          placeholder="PHONE"
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        />

        <input
          placeholder="ADDRESS"
          value={form.address}
          onChange={(e) =>
            setForm({
              ...form,
              address: e.target.value,
            })
          }
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        />

        <input
          placeholder="CITY"
          value={form.city}
          onChange={(e) =>
            setForm({
              ...form,
              city: e.target.value,
            })
          }
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        />

        <input
          placeholder="STATE"
          value={form.state}
          onChange={(e) =>
            setForm({
              ...form,
              state: e.target.value,
            })
          }
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        />

        <input
          placeholder="ZIP"
          value={form.zip}
          onChange={(e) =>
            setForm({
              ...form,
              zip: e.target.value,
            })
          }
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl"
        />

        <button
          onClick={saveClient}
          className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold"
        >
          SAVE CLIENT
        </button>

        <a
          href="/clients"
          className="text-gray-400 text-xl"
        >
          Cancel
        </a>
      </div>
    </main>
  )
}