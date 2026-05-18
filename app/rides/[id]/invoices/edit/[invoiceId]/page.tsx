'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import DatePicker from '@/components/DatePicker'
import { supabase } from '@/lib/supabase'
import { formatUSD } from '@/lib/utils'

type Part = {
  id?: string
  description: string
  unit_price: string
  quantity: string
}

export default function EditInvoicePage() {
  const params = useParams()
  const router = useRouter()
  const rideId = String(params.id)
  const invoiceId = String(params.invoiceId)

  const [loading, setLoading] = useState(true)
  const [projectCode, setProjectCode] = useState('')
  const [projectName, setProjectName] = useState('')
  const [invoiceCode, setInvoiceCode] = useState('')
  const [entryDate, setEntryDate] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [mileage, setMileage] = useState('')
  const [service, setService] = useState('')
  const [floridaTaxes, setFloridaTaxes] = useState('')
  const [globalDiscount, setGlobalDiscount] = useState('')
  const [parts, setParts] = useState<Part[]>([])
  const [newPart, setNewPart] = useState<Part>({ description: '', unit_price: '', quantity: '1' })

  useEffect(() => {
    loadRide()
    loadInvoice()
  }, [])

  async function loadRide() {
    const { data } = await supabase
      .from('rides')
      .select('project_code, project_name')
      .eq('id', rideId)
      .single()

    if (data) {
      setProjectCode(data.project_code || '')
      setProjectName(data.project_name || '')
    }
  }

  async function loadInvoice() {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single()

    if (error || !data) {
      alert('Invoice not found')
      router.push(`/rides/${rideId}/invoices`)
      return
    }

    setInvoiceCode(data.invoice_code || '')
    setEntryDate(data.entry_date || '')
    setDeliveryDate(data.delivery_date || '')
    setMileage(data.mileage ? Number(data.mileage).toLocaleString('en-US') : '')
    setService(data.service || '')
    setFloridaTaxes(data.florida_taxes ? String(data.florida_taxes) : '')
    setGlobalDiscount(data.global_discount ? String(data.global_discount) : '')

    const { data: partsData } = await supabase
      .from('invoice_parts')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: true })

    if (partsData) {
      setParts(partsData.map(p => ({
        id: p.id,
        description: p.description,
        unit_price: String(p.unit_price),
        quantity: String(p.quantity),
      })))
    }

    setLoading(false)
  }

  function isValidDate(d: string) {
    return !!d && d.match(/^\d{4}-\d{2}-\d{2}$/) !== null
  }

  function formatMileage(value: string) {
    const clean = value.replace(/[^0-9.]/g, '')
    const partsArr = clean.split('.')
    const intPart = partsArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return partsArr.length > 1 ? `${intPart}.${partsArr[1]}` : intPart
  }

  function addPart() {
    if (!newPart.description || !newPart.unit_price || !newPart.quantity) {
      alert('Please fill in all part fields')
      return
    }
    setParts([...parts, newPart])
    setNewPart({ description: '', unit_price: '', quantity: '1' })
  }

  async function removePart(index: number) {
    const part = parts[index]
    if (part.id) {
      await supabase.from('invoice_parts').delete().eq('id', part.id)
    }
    setParts(parts.filter((_, i) => i !== index))
  }

  function getPartTotal(part: Part) {
    const price = parseFloat(part.unit_price) || 0
    const qty = parseFloat(part.quantity) || 0
    return price * qty
  }

  async function saveInvoice() {
    const { error } = await supabase
      .from('invoices')
      .update({
        entry_date: isValidDate(entryDate) ? entryDate : null,
        delivery_date: isValidDate(deliveryDate) ? deliveryDate : null,
        mileage: mileage ? parseFloat(mileage.replace(/,/g, '')) : null,
        service: service || null,
        florida_taxes: floridaTaxes ? parseFloat(floridaTaxes) : null,
        global_discount: globalDiscount ? parseFloat(globalDiscount) : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)

    if (error) {
      alert(error.message)
      return
    }

    const newParts = parts.filter(p => !p.id)
    if (newParts.length > 0) {
      const { error: partsError } = await supabase
        .from('invoice_parts')
        .insert(newParts.map(p => ({
          invoice_id: invoiceId,
          description: p.description,
          unit_price: parseFloat(p.unit_price),
          quantity: parseFloat(p.quantity),
        })))

      if (partsError) {
        alert(partsError.message)
        return
      }
    }

    router.push(`/rides/${rideId}/invoices`)
  }

  const inputClass = 'w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-xl'
  const smallInputClass = 'bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 text-lg'

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <Header />
        <p className="text-2xl text-gray-400">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <h1 className="text-4xl font-bold mb-2">EDIT INVOICE</h1>
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

        <DatePicker
          label="DELIVERY DATE"
          value={deliveryDate}
          onChange={setDeliveryDate}
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

        {/* PARTS SECTION */}
        <div>
          <label className="block mb-3 text-lg font-bold">PARTS</label>

          {/* New part input box */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 space-y-3">
            <input
              type="text"
              placeholder="Description"
              value={newPart.description}
              onChange={(e) => setNewPart({ ...newPart, description: e.target.value })}
              className={inputClass}
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block mb-1 text-sm text-gray-400">UNIT PRICE</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={newPart.unit_price}
                    onChange={(e) => setNewPart({ ...newPart, unit_price: e.target.value })}
                    className={`${smallInputClass} w-full pl-8`}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm text-gray-400">QUANTITY</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  value={newPart.quantity}
                  onChange={(e) => setNewPart({ ...newPart, quantity: e.target.value })}
                  className={`${smallInputClass} w-full`}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm text-gray-400">TOTAL</label>
                <div className={`${smallInputClass} w-full opacity-50`}>
                  {newPart.unit_price && newPart.quantity
                    ? formatUSD(parseFloat(newPart.unit_price || '0') * parseFloat(newPart.quantity || '0'))
                    : '$0.00'}
                </div>
              </div>
            </div>
            <button
              onClick={addPart}
              className="bg-gray-600 hover:bg-gray-500 px-5 py-3 rounded-2xl font-bold text-lg"
            >
              + ADD PART
            </button>
          </div>

          {/* Added parts list — shown below the input box */}
          {parts.length > 0 && (
            <div className="space-y-3 mt-4">
              {parts.map((part, index) => (
                <div key={index} className="bg-gray-800 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-lg font-bold">{part.description}</p>
                    <p className="text-gray-400">
                      {formatUSD(parseFloat(part.unit_price))} × {part.quantity} = {formatUSD(getPartTotal(part))}
                    </p>
                  </div>
                  <button
                    onClick={() => removePart(index)}
                    className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-xl font-bold text-sm"
                  >
                    REMOVE
                  </button>
                </div>
              ))}
            </div>
          )}
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
          SAVE CHANGES
        </button>

        <a href={`/rides/${rideId}/invoices`} className="text-gray-400 text-xl">Cancel</a>
      </div>
    </main>
  )
}