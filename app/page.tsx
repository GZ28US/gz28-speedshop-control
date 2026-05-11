'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Transaction = {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  transaction_date: string
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setTransactions(data || [])
  }

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const profit = income - expenses

  return (
    <main className="min-h-screen p-8 bg-black text-white">
      <h1 className="text-4xl font-bold mb-8">
        GZ28 V8 SpeedShop $ CONTROL
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-green-700 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold">Income</h2>
          <p className="text-3xl mt-2">
            ${income.toFixed(2)}
          </p>
        </div>

        <div className="bg-red-700 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold">Expenses</h2>
          <p className="text-3xl mt-2">
            ${expenses.toFixed(2)}
          </p>
        </div>

        <div className="bg-blue-700 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold">Profit</h2>
          <p className="text-3xl mt-2">
            ${profit.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {transactions.map(transaction => (
          <div
            key={transaction.id}
            className="border border-gray-700 rounded-xl p-4 flex justify-between"
          >
            <div>
              <p className="font-semibold">
                {transaction.description}
              </p>

              <p className="text-sm text-gray-400">
                {transaction.transaction_date}
              </p>
            </div>

            <div
              className={
                transaction.type === 'income'
                  ? 'text-green-400 font-bold'
                  : 'text-red-400 font-bold'
              }
            >
              ${Number(transaction.amount).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}