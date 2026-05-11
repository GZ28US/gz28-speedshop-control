'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Category = {
  id: string
  name: string
  parent_id: string | null
  type: string
  code: string
}

export default function MobileExpensePage() {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [mainCategories, setMainCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Category[]>([])
  const [selectedMain, setSelectedMain] = useState<Category | null>(null)
  const [selectedSub, setSelectedSub] = useState<Category | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadMainCategories()
  }, [])

  async function loadMainCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('type', 'expense')
      .is('parent_id', null)
      .order('code')

    setMainCategories(data || [])
  }

  async function chooseMain(category: Category) {
    setSelectedMain(category)
    setSelectedSub(null)

    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', category.id)
      .order('code')

    setSubcategories(data || [])
  }

  async function saveExpense() {
    if (!amount || !description || !selectedMain) {
      setMessage('Please fill amount, category, and description.')
      return
    }

    const categoryId = selectedSub?.id || selectedMain.id

    const { error } = await supabase.from('transactions').insert({
      type: 'expense',
      amount: Number(amount),
      description,
      category_id: categoryId,
      source: 'mobile-expense',
      transaction_date: new Date().toISOString().slice(0, 10),
    })

    if (error) {
      setMessage(error.message)
      return
    }

    setAmount('')
    setDescription('')
    setSelectedMain(null)
    setSelectedSub(null)
    setSubcategories([])
    setMessage('Expense saved successfully ✅')
  }

  return (
    <main className="min-h-screen bg-black text-white p-5">
      <h1 className="text-3xl font-bold mb-6">
        GZ28 Expense Entry
      </h1>

      <label className="block mb-2 text-sm text-gray-300">
        Amount
      </label>
      <input
        className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 mb-5"
        placeholder="Example: 150"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        type="number"
      />

      <h2 className="text-xl font-semibold mb-3">
        Main Category
      </h2>

      <div className="space-y-3 mb-6">
        {mainCategories.map(category => (
          <button
            key={category.id}
            onClick={() => chooseMain(category)}
            className={`w-full p-4 rounded-xl text-left border ${
              selectedMain?.id === category.id
                ? 'bg-blue-700 border-blue-400'
                : 'bg-gray-900 border-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {subcategories.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-3">
            Subcategory
          </h2>

          <div className="space-y-3 mb-6">
            {subcategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedSub(category)}
                className={`w-full p-4 rounded-xl text-left border ${
                  selectedSub?.id === category.id
                    ? 'bg-blue-700 border-blue-400'
                    : 'bg-gray-900 border-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </>
      )}

      <label className="block mb-2 text-sm text-gray-300">
        Description
      </label>
      <textarea
        className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 mb-5"
        placeholder="Example: Oil filter purchase"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-5">
        <p><strong>Amount:</strong> ${amount || '0.00'}</p>
        <p><strong>Category:</strong> {selectedMain?.name || '-'}</p>
        <p><strong>Subcategory:</strong> {selectedSub?.name || '-'}</p>
        <p><strong>Description:</strong> {description || '-'}</p>
      </div>

      <button
        onClick={saveExpense}
        className="w-full bg-green-700 p-4 rounded-xl text-xl font-bold"
      >
        Save Expense
      </button>

      {message && (
        <p className="mt-5 text-center text-lg">
          {message}
        </p>
      )}
    </main>
  )
}