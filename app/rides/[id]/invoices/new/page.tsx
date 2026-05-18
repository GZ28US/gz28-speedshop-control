'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import DatePicker from '@/components/DatePicker'
import { supabase } from '@/lib/supabase'

export default function NewInvoicePage() {
  const params = useParams()
  const router = useRouter()
  const rideId = String(params.id)

  const [projectCode, setProjectCode] = useState('')
  const [projectName, setProjectName] = useState('')
  const [invoiceCode, setInvoiceCode] = useState('')
  const [entryDate, setEntryDate] = useState('')
  const [mileage, setMileage] = useState('')
  const [service, setService] = useState('')
  const [floridaTaxes, setFloridaTaxes] = useState('')
  const [globalDiscount, setGlobalDiscount] = useState('')

  useEffect(() => {
    loadRide()
  }, [])

  async function loadRide() {
    const { data: ride } = await supabase
      .from('rides')
      .select('project_code, project_name')
      .eq('id', rideId)
      .single()

    if (ride) {
      setProjectCode(ride.project_code || '')
      setProjectName(ride.project_name || '')
      await loadNextInvoiceCode(ride.project_code)
    }
  }

  async function loadNextInvoiceCode(code: string) {
    const { data } = await supabase
      .from('invoices')
      .select('invoice_code')
      .eq('ride_id', rideId)

    const usedNumbers = data?.map((item) => {
      const match = item.invoice_code?.match(/\.(\d+)$/)
      return match ? Number(match[1]) : null
    }) || []

    let nextNumber = 1
    while (usedNumbers.includes(nextNumber)) nextNumber++

    setInvoiceCode(`${code}.${nextNumber}`)
  }

  function isValidDate(d: string) {
    return !!d && d.match(/^\d{4}-\d{2}-\d{2}$/) !== null
  }

  function formatMileage(value: string) {
    const clean = value.replace(/[^0-9.]/g, '')
    const parts = clean.split('.')
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart
  }

  async function saveInvoice() {
    const { error } = await supabase
      .from('invoices')
      .insert([{
        invoice_code: invoiceCode,
        ride_id: rideId,
        entry_date: isValidDate(entryDate) ? entryDate : null,
        mileage: mileage ? parseFloat(mileage.replace(/,/g, '')) : null,
        service: service || null,
        florida_taxes: floridaTaxes ? parseFloat(floridaTaxes) : null,
        global_discount: globalDiscount ? parseFloat(globalDiscount) : null,
      }])

    if (error) {
      alert(error.message)
      return
    }

    router.push(`/rides/${rideId}/invoices`)
  }

  const inputClass = 'w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl'

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <h1 className="text-4xl font-bold mb-2">ADD A NEW INVOICE</h1>
      <p className="text-gray-400 text-xl mb-8">{projectCode}{projectName ? ` — ${projectName}` : ''}</p>

      <div className="grid grid-cols-1 gap-5 max-w-2xl">

        <div>
          <label className="block mb-2 text-lg font-bold">INVOICE CODE</label>
          <input
            value={invoiceCode}
            readOnly
            className={`${inputClass} opacity-50 cursor-not-allowed`}
          />
        </div>

        <DatePicker
          label="ENTRY DATE"
          value={entryDate}
          onChange={setEntryDate}
        />

        <div>
          <label className="block mb-2 text-lg font-bold">MILEAGE</label>
          <input
            type="text"
            value={mileage}
            onChange={(e) => setMileage(formatMileage(e.target.value))}
            className={inputClass}
            placeholder="0"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">SERVICE</label>
          <input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={inputClass}
            placeholder="Service description"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">ADD PART</label>
          <button
            className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-2xl text-xl font-bold text-left"
            onClick={() => alert('Coming soon')}
          >
            + ADD PART
          </button>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">FLORIDA TAXES (%)</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={floridaTaxes}
              onChange={(e) => setFloridaTaxes(e.target.value)}
              className={`${inputClass} pr-10`}
              placeholder="0.00"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-gray-400">%</span>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">ADD SERVICE</label>
          <button
            className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-2xl text-xl font-bold text-left"
            onClick={() => alert('Coming soon')}
          >
            + ADD SERVICE
          </button>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">GLOBAL DISCOUNT (%)</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={globalDiscount}
              onChange={(e) => setGlobalDiscount(e.target.value)}
              className={`${inputClass} pr-10`}
              placeholder="0.00"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-gray-400">%</span>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">ADD PAYMENT</label>
          <button
            className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-2xl text-xl font-bold text-left"
            onClick={() => alert('Coming soon')}
          >
            + ADD PAYMENT
          </button>
        </div>

        <div>
          <label className="block mb-2 text-lg font-bold">ADD EXPENSE</label>
          <button
            className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-2xl text-xl font-bold text-left"
            onClick={() => alert('Coming soon')}
          >
            + ADD EXPENSE
          </button>
        </div>

        <button
          onClick={saveInvoice}
          className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold"
        >
          SAVE INVOICE
        </button>

        <a href={`/rides/${rideId}/invoices`} className="text-gray-400 text-xl">Cancel</a>
      </div>
    </main>
  )
}