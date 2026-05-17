'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Transaction = {
  id: string
  type: string
  amount: number
  description: string
  transaction_date: string
}

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState(0)

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    if (!data) return

    setTransactions(data)

    const totalIncome = data
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpenses = data
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    setIncome(totalIncome)
    setExpenses(totalExpenses)
  }

  const profit = income - expenses

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-5xl font-bold mb-10">
        GZ28US Financial CONTROL
      </h1>

      <div className="flex gap-4 mb-10">
        <button className="bg-gray-900 hover:bg-gray-700 border border-gray-700 px-6 py-4 rounded-2xl text-xl font-bold">
          CLIENTS
        </button>

        <button className="bg-gray-900 hover:bg-gray-700 border border-gray-700 px-6 py-4 rounded-2xl text-xl font-bold">
          RIDES
        </button>

        <button className="bg-gray-900 hover:bg-gray-700 border border-gray-700 px-6 py-4 rounded-2xl text-xl font-bold">
          STAFF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-green-700 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-3">Income</h2>
          <p className="text-5xl">${income.toFixed(2)}</p>
        </div>

        <div className="bg-red-700 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-3">Expenses</h2>
          <p className="text-5xl">${expenses.toFixed(2)}</p>
        </div>

        <div className="bg-blue-700 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-3">Profit</h2>
          <p className="text-5xl">${profit.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-5">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="border border-gray-800 rounded-3xl p-5 flex items-center justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold">
                {transaction.description}
              </h3>

              <p className="text-gray-400 text-xl">
                {transaction.transaction_date}
              </p>
            </div>

            <div
              className={`text-3xl font-bold ${
                transaction.type === 'income'
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'}$
              {Number(transaction.amount).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}