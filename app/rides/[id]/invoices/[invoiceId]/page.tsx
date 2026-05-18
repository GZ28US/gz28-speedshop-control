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
  delivery_date: string | null
  mileage: number | null
  service: string | null
  florida_taxes: number | null
  global_discount: number | null
}

type Part = { id: string; description: string; unit_price: number; quantity: number }
type Service = { id: string; description: string; price: number }
type Payment = { id: string; amount: number; payment_date: string | null; source: string }
type Note = { id: string; note: string }
type Expense = { id: string; expense_date: string | null; supplier: string | null; item: string; price: number; payment_date: string | null }

export default function ViewInvoicePage() {
  const params = useParams()
  const rideId = String(params.id)
  const invoiceId = String(params.invoiceId)

  const [loading, setLoading] = useState(true)
  const [projectCode, setProjectCode] = useState('')
  const [projectName, setProjectName] = useState('')
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [parts, setParts] = useState<Part[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const { data: ride } = await supabase.from('rides').select('project_code, project_name').eq('id', rideId).single()
    if (ride) { setProjectCode(ride.project_code || ''); setProjectName(ride.project_name || '') }

    const { data: inv } = await supabase.from('invoices').select('*').eq('id', invoiceId).single()
    if (inv) setInvoice(inv)

    const { data: partsData } = await supabase.from('invoice_parts').select('*').eq('invoice_id', invoiceId).order('created_at', { ascending: true })
    if (partsData) setParts(partsData)

    const { data: servicesData } = await supabase.from('invoice_services').select('*').eq('invoice_id', invoiceId).order('created_at', { ascending: true })
    if (servicesData) setServices(servicesData)

    const { data: paymentsData } = await supabase.from('invoice_payments').select('*').eq('invoice_id', invoiceId).order('created_at', { ascending: true })
    if (paymentsData) setPayments(paymentsData)

    const { data: notesData } = await supabase.from('invoice_notes').select('*').eq('invoice_id', invoiceId).order('created_at', { ascending: true })
    if (notesData) setNotes(notesData)

    const { data: expensesData } = await supabase.from('invoice_expenses').select('*').eq('invoice_id', invoiceId).order('created_at', { ascending: true })
    if (expensesData) setExpenses(expensesData)

    setLoading(false)
  }

  function formatDate(d: string | null) {
    if (!d) return '-'
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  function isValidDate(d: string | null) { return !!d && d.match(/^\d{4}-\d{2}-\d{2}$/) !== null }

  function getStatus() {
    if (!invoice?.delivery_date) return 'OPEN'
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const d = new Date(invoice.delivery_date + 'T00:00:00')
    return d <= today ? 'CLOSED' : 'OPEN'
  }

  if (loading) return (
    <main className="min-h-screen bg-black text-white p-8"><Header /><p className="text-2xl text-gray-400">Loading...</p></main>
  )

  if (!invoice) return (
    <main className="min-h-screen bg-black text-white p-8"><Header /><p className="text-2xl text-gray-400">Invoice not found.</p></main>
  )

  // Calculations
  const partsSubTotal = parts.reduce((s, p) => s + p.unit_price * p.quantity, 0)
  const floridaTaxesAmount = partsSubTotal * ((invoice.florida_taxes || 0) / 100)
  const partsTotal = partsSubTotal + floridaTaxesAmount
  const servicesTotal = services.reduce((s, sv) => s + sv.price, 0)
  const partsAndServicesTotal = partsTotal + servicesTotal
  const globalDiscountAmount = partsAndServicesTotal * ((invoice.global_discount || 0) / 100)
  const grandTotal = partsAndServicesTotal - globalDiscountAmount
  const totalPaid = payments.reduce((s, p) => s + p.amount, 0)
  const balance = totalPaid - grandTotal
  const expensesTotalGlobal = expenses.reduce((s, e) => s + e.price, 0)
  const expensesTotalPaid = expenses.filter(e => e.payment_date).reduce((s, e) => s + e.price, 0)
  const expensesBalance = expensesTotalPaid - expensesTotalGlobal
  const currentProfit = totalPaid - expensesTotalPaid
  const currentProfitPct = expensesTotalPaid > 0 ? (currentProfit / expensesTotalPaid) * 100 : 0
  const finalProfit = grandTotal - expensesTotalGlobal
  const finalProfitPct = expensesTotalGlobal > 0 ? (finalProfit / expensesTotalGlobal) * 100 : 0
  const profitColor = (val: number) => val < 0 ? 'text-red-500' : 'text-blue-400'
  const status = getStatus()

  const rowClass = 'flex items-center justify-between gap-4 px-4 py-3 border-b border-gray-700 last:border-0'
  const labelClass = 'text-gray-400 font-bold'
  const sectionClass = 'bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden'

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl font-bold">{invoice.invoice_code}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${status === 'CLOSED' ? 'bg-gray-700 text-gray-300' : 'bg-green-800 text-green-300'}`}>
              {status}
            </span>
          </div>
          <p className="text-gray-400 text-xl">{projectCode}{projectName ? ` — ${projectName}` : ''}</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/rides/${rideId}/invoices`} className="bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-2xl text-xl font-bold">BACK</Link>
          <Link href={`/rides/${rideId}/invoices/edit/${invoiceId}`} className="bg-blue-700 hover:bg-blue-600 px-6 py-4 rounded-2xl text-xl font-bold">EDIT</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 max-w-2xl">

        {/* HEADER INFO */}
        <div className={sectionClass}>
          <div className={rowClass}>
            <span className={labelClass}>ENTRY DATE</span>
            <span className="font-bold">{formatDate(invoice.entry_date)}</span>
          </div>
          <div className={rowClass}>
            <span className={labelClass}>DELIVERY DATE</span>
            <span className="font-bold">{formatDate(invoice.delivery_date)}</span>
          </div>
          {invoice.mileage && (
            <div className={rowClass}>
              <span className={labelClass}>MILEAGE</span>
              <span className="font-bold">{Number(invoice.mileage).toLocaleString('en-US')} mi</span>
            </div>
          )}
          {invoice.service && (
            <div className={rowClass}>
              <span className={labelClass}>SERVICE</span>
              <span className="font-bold">{invoice.service}</span>
            </div>
          )}
        </div>

        {/* PARTS */}
        {parts.length > 0 && (
          <div>
            <label className="block mb-3 text-lg font-bold">PARTS</label>
            <div className={sectionClass}>
              {parts.map((part, index) => (
                <div key={part.id} className={`flex items-center justify-between gap-4 px-4 py-3 ${index < parts.length - 1 ? 'border-b border-gray-700' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold truncate">{part.description}</p>
                    <p className="text-sm text-gray-400">{formatUSD(part.unit_price)} × {part.quantity} = {formatUSD(part.unit_price * part.quantity)}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-700 px-4 py-3 flex justify-between">
                <span className="text-gray-400 font-bold">PARTS SUB-TOTAL</span>
                <span className="font-bold">{formatUSD(partsSubTotal)}</span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center border-t border-gray-700">
                <span className="text-gray-400 font-bold">FLORIDA PARTS TAXES ({invoice.florida_taxes || 0}%)</span>
                <span className="font-bold">{formatUSD(floridaTaxesAmount)}</span>
              </div>
              <div className="px-4 py-3 flex justify-between border-t border-gray-700">
                <span className="font-bold text-lg">PARTS TOTAL</span>
                <span className="text-xl font-bold">{formatUSD(partsTotal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES */}
        {services.length > 0 && (
          <div>
            <label className="block mb-3 text-lg font-bold">SERVICES</label>
            <div className={sectionClass}>
              {services.map((svc, index) => (
                <div key={svc.id} className={`flex items-center justify-between gap-4 px-4 py-3 ${index < services.length - 1 ? 'border-b border-gray-700' : ''}`}>
                  <p className="text-base font-bold flex-1 truncate">{svc.description}</p>
                  <p className="text-gray-400 font-bold">{svc.price === 0 ? 'COURTESY' : formatUSD(svc.price)}</p>
                </div>
              ))}
              <div className="border-t border-gray-700 px-4 py-3 flex justify-between">
                <span className="font-bold text-lg">SERVICES TOTAL</span>
                <span className="text-xl font-bold">{formatUSD(servicesTotal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* TOTALS */}
        <div className={sectionClass}>
          <div className={rowClass}>
            <span className={labelClass}>PARTS + SERVICES TOTAL</span>
            <span className="font-bold">{formatUSD(partsAndServicesTotal)}</span>
          </div>
          <div className={rowClass}>
            <span className={labelClass}>GLOBAL DISCOUNT ({invoice.global_discount || 0}%)</span>
            <span className="font-bold text-red-400">- {formatUSD(globalDiscountAmount)}</span>
          </div>
          <div className="px-4 py-3 flex justify-between">
            <span className="font-bold text-xl">GRAND TOTAL</span>
            <span className="text-3xl font-bold">{formatUSD(grandTotal)}</span>
          </div>
        </div>

        {/* PAYMENTS */}
        {payments.length > 0 && (
          <div>
            <label className="block mb-3 text-lg font-bold">PAYMENTS</label>
            <div className={sectionClass}>
              {payments.map((payment, index) => (
                <div key={payment.id} className={`flex items-center justify-between gap-4 px-4 py-3 ${index < payments.length - 1 ? 'border-b border-gray-700' : ''}`}>
                  <div>
                    <p className="text-base font-bold">{formatUSD(payment.amount)}</p>
                    <p className="text-sm text-gray-400">{payment.source}{payment.payment_date ? ` — ${formatDate(payment.payment_date)}` : ''}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-700 px-4 py-3 flex justify-between">
                <span className={labelClass}>TOTAL PAID</span>
                <span className="font-bold">{formatUSD(totalPaid)}</span>
              </div>
              <div className="px-4 py-3 flex justify-between">
                <span className="font-bold text-lg">BALANCE</span>
                <span className={`text-2xl font-bold ${balance < 0 ? 'text-red-500' : 'text-blue-400'}`}>{formatUSD(balance)}</span>
              </div>
            </div>
          </div>
        )}

        {/* NOTES */}
        {notes.length > 0 && (
          <div>
            <label className="block mb-3 text-lg font-bold">NOTES</label>
            <div className={sectionClass}>
              {notes.map((n, index) => (
                <div key={n.id} className={`px-4 py-3 ${index < notes.length - 1 ? 'border-b border-gray-700' : ''}`}>
                  <p className="text-base text-gray-300 whitespace-pre-wrap">{n.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPENSES */}
        {expenses.length > 0 && (
          <div>
            <label className="block mb-3 text-lg font-bold">EXPENSES</label>
            <div className={sectionClass}>
              {expenses.map((exp, index) => {
                const isPaid = isValidDate(exp.payment_date)
                const rowColor = isPaid ? 'text-blue-400' : 'text-red-400'
                return (
                  <div key={exp.id} className={`px-4 py-3 ${index < expenses.length - 1 ? 'border-b border-gray-700' : ''}`}>
                    <p className={`text-base font-bold truncate ${rowColor}`}>{exp.item}{exp.supplier ? ` — ${exp.supplier}` : ''}</p>
                    <p className={`text-sm ${rowColor}`}>
                      {formatUSD(exp.price)}
                      {exp.expense_date ? ` — ${formatDate(exp.expense_date)}` : ''}
                    </p>
                    <p className="text-sm text-gray-500">{isPaid ? `Paid: ${formatDate(exp.payment_date)}` : 'Not paid yet'}</p>
                  </div>
                )
              })}
              <div className="border-t border-gray-700 px-4 py-3 flex justify-between">
                <span className={labelClass}>TOTAL GLOBAL</span>
                <span className="font-bold">{formatUSD(expensesTotalGlobal)}</span>
              </div>
              <div className="px-4 py-3 flex justify-between border-t border-gray-700">
                <span className={labelClass}>TOTAL PAID</span>
                <span className="font-bold">{formatUSD(expensesTotalPaid)}</span>
              </div>
              <div className="px-4 py-3 flex justify-between border-t border-gray-700">
                <span className="font-bold text-lg">BALANCE</span>
                <span className={`text-2xl font-bold ${expensesBalance < 0 ? 'text-red-500' : 'text-blue-400'}`}>{formatUSD(expensesBalance)}</span>
              </div>
              <div className="border-t border-gray-700 px-4 py-3 flex justify-between">
                <span className={labelClass}>CURRENT PROFIT</span>
                <span className={`font-bold ${profitColor(currentProfit)}`}>{formatUSD(currentProfit)} / {currentProfitPct.toFixed(1)}%</span>
              </div>
              <div className="px-4 py-3 flex justify-between border-t border-gray-700">
                <span className="font-bold text-lg">FINAL PROFIT</span>
                <span className={`text-xl font-bold ${profitColor(finalProfit)}`}>{formatUSD(finalProfit)} / {finalProfitPct.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}