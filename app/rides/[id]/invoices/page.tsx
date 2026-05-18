'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'
import { formatUSD } from '@/lib/utils'

type Invoice = {
  id: string
  invoice_code: string
  entry_date: string | null
  mileage: number | null
  service: string | null
  florida_taxes: number | null
  global_discount: number | null
}

type Ride = {
  project_code: string
  project_name: string | null
}

export default function InvoicesPage() {
  const params = useParams()
  const rideId = String(params.id)

  const [ride, setRide] = useState<Ride | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    loadRide()
    loadInvoices()
  }, [])

  async function loadRide() {
    const { data } = await supabase
      .from('rides')
      .select('project_code, project_name')
      .eq('id', rideId)
      .single()

    setRide(data || null)
  }

  async function loadInvoices() {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('ride_id', rideId)
      .order('invoice_code', { ascending: true })

    setInvoices(data || [])
    setLoading(false)
  }

  async function removeInvoice(id: string) {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    setConfirmId(null)
    loadInvoices()
  }

  function formatDate(date: string | null) {
    if (!date) return '-'
    return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      {confirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-sm w-full mx-4">
            <h2 className="text-2xl font-bold mb-2">Remove Invoice</h2>
            <p className="text-gray-400 text-lg mb-8">Are you sure you want to remove this invoice? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-5 py-4 rounded-2xl font-bold text-xl"
              >
                CANCEL
              </button>
              <button
                onClick={() => removeInvoice(confirmId)}
                className="flex-1 bg-red-700 hover:bg-red-600 px-5 py-4 rounded-2xl font-bold text-xl"
              >
                REMOVE
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            {ride?.project_code} — INVOICES ({invoices.length})
          </h1>
          {ride?.project_name && (
            <p className="text-xl text-gray-400 mt-1">{ride.project_name}</p>
          )}
        </div>

        <div className="flex gap-4">
          <Link
            href="/rides"
            className="bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-2xl text-xl font-bold"
          >
            BACK
          </Link>
          <Link
            href={`/rides/${rideId}/invoices/new`}
            className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold"
          >
            ADD A NEW INVOICE
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-2xl text-gray-400">Loading...</p>
      ) : invoices.length === 0 ? (
        <p className="text-2xl text-gray-400">No invoices yet.</p>
      ) : (
        <div className="space-y-5">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex items-center justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold">{invoice.invoice_code}</h2>
                <p className="text-lg text-gray-400">{formatDate(invoice.entry_date)}</p>
                {invoice.service && (
                  <p className="text-lg text-gray-400">{invoice.service}</p>
                )}
                {invoice.mileage && (
                  <p className="text-lg text-gray-400">{Number(invoice.mileage).toLocaleString('en-US')} mi</p>
                )}
              </div>

              <div className="flex gap-3 flex-wrap">
                <Link
                  href={`/rides/${rideId}/invoices/edit/${invoice.id}`}
                  className="bg-blue-700 hover:bg-blue-600 px-5 py-3 rounded-2xl font-bold"
                >
                  EDIT
                </Link>

                <button
                  onClick={() => setConfirmId(invoice.id)}
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