'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

type Expense = {
  id: string
  type: string
  description: string | null
  amount: number
  source: string | null
  expense_date: string
}

export default function ExpensesPage() {
  const params = useParams()
  const staffId = String(params.id)
  const seasonID = String(params.seasonID)

  const [seasonCode, setSeasonCode] = useState('')
  const [staffName, setStaffName] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    loadInfo()
    loadExpenses()
  }, [])

  async function loadInfo() {
    const { data: season } = await supabase
      .from('seasons')
      .select('season_code, staff_id')
      .eq('id', seasonID)
      .single()

    if (season) {
      setSeasonCode(season.season_code)

      const { data: staff } = await supabase
        .from('staff')
        .select('name')
        .eq('id', season.staff_id)
        .single()

      setStaffName(staff?.name || '')
    }
  }

  async function loadExpenses() {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('season_id', seasonID)
      .order('expense_date', { ascending: false })

    setExpenses(data || [])
    setLoading(false)
  }

  async function removeExpense(id: string) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    setConfirmId(null)
    loadExpenses()
  }

  function formatDate(date: string) {
    return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Header />

      {confirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-sm w-full mx-4">
            <h2 className="text-2xl font-bold mb-2">Remove Expense</h2>
            <p className="text-gray-400 text-lg mb-8">Are you sure you want to remove this expense? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-5 py-4 rounded-2xl font-bold text-xl"
              >
                CANCEL
              </button>
              <button
                onClick={() => removeExpense(confirmId)}
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
            {staffName} — {seasonCode}
          </h1>
          <p className="text-xl text-gray-400 mt-1">EXPENSES ({expenses.length})</p>
        </div>

        <div className="flex gap-4">
          <Link
            href={`/staff/${staffId}/seasons`}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-2xl text-xl font-bold"
          >
            BACK
          </Link>
          <Link
            href={`/staff/${staffId}/seasons/${seasonID}/expenses/new`}
            className="bg-green-700 hover:bg-green-600 px-6 py-4 rounded-2xl text-xl font-bold"
          >
            ADD NEW EXPENSE
          </Link>
        </div>
      </div>

      {expenses.length > 0 && (
        <div className="bg-red-700 rounded-3xl p-6 mb-8 max-w-sm">
          <p className="text-xl font-bold">TOTAL EXPENSES</p>
          <p className="text-5xl font-bold">${total.toFixed(2)}</p>
        </div>
      )}

      {loading ? (
        <p className="text-2xl text-gray-400">Loading...</p>
      ) : expenses.length === 0 ? (
        <p className="text-2xl text-gray-400">No expenses yet.</p>
      ) : (
        <div className="space-y-5">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex items-center justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold">${Number(expense.amount).toFixed(2)}</h2>
                {expense.description && (
                  <p className="text-lg text-white">{expense.description}</p>
                )}
                <p className="text-lg text-gray-400">{expense.type}</p>
                {expense.source && (
                  <p className="text-lg text-gray-400">{expense.source}</p>
                )}
                <p className="text-lg text-gray-400">{formatDate(expense.expense_date)}</p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Link
                  href={`/staff/${staffId}/seasons/${seasonID}/expenses/edit/${expense.id}`}
                  className="bg-blue-700 hover:bg-blue-600 px-5 py-3 rounded-2xl font-bold"
                >
                  EDIT
                </Link>

                <button
                  onClick={() => setConfirmId(expense.id)}
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