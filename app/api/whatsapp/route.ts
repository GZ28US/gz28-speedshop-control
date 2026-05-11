import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function parseAmount(text: string) {
  const cleaned = text.replace(/usd/gi, '').replace(/\$/g, '').trim()
  const amount = Number(cleaned)

  return Number.isFinite(amount) ? amount : null
}

export async function POST(request: Request) {
  const body = await request.json()

  const messageText =
    body.message_text ||
    body.text ||
    body.message ||
    ''

  const senderPhone =
    body.sender_phone ||
    body.phone ||
    'unknown'

  const { data: existingSession } = await supabase
    .from('whatsapp_expense_sessions')
    .select('*')
    .eq('phone_number', senderPhone)
    .eq('is_completed', false)
    .maybeSingle()

  if (!existingSession) {
    await supabase.from('whatsapp_expense_sessions').insert({
      phone_number: senderPhone,
      current_step: 'amount',
    })

    return NextResponse.json({
      success: true,
      reply: 'Amount?',
    })
  }

  if (existingSession.current_step === 'amount') {
    const amount = parseAmount(messageText)

    if (!amount) {
      return NextResponse.json({
        success: true,
        reply: 'Please send a valid amount. Example: USD 150',
      })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        amount,
        current_step: 'main_category',
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingSession.id)

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, code')
      .eq('type', 'expense')
      .is('parent_id', null)
      .order('code')

    return NextResponse.json({
      success: true,
      reply:
        'Choose main category:\n' +
        categories?.map((c, i) => `${i + 1}. ${c.name}`).join('\n'),
    })
  }

  if (existingSession.current_step === 'main_category') {
    const choice = Number(messageText)

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, code')
      .eq('type', 'expense')
      .is('parent_id', null)
      .order('code')

    const selected = categories?.[choice - 1]

    if (!selected) {
      return NextResponse.json({
        success: true,
        reply: 'Invalid option. Please choose a number from the list.',
      })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        selected_category_id: selected.id,
        current_step: 'subcategory',
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingSession.id)

    const { data: subcategories } = await supabase
      .from('categories')
      .select('id, name, code')
      .eq('parent_id', selected.id)
      .order('code')

    if (!subcategories || subcategories.length === 0) {
      return NextResponse.json({
        success: true,
        reply: 'Description?',
      })
    }

    return NextResponse.json({
      success: true,
      reply:
        'Choose subcategory:\n' +
        subcategories.map((c, i) => `${i + 1}. ${c.name}`).join('\n'),
    })
  }

  if (existingSession.current_step === 'subcategory') {
    const choice = Number(messageText)

    const { data: subcategories } = await supabase
      .from('categories')
      .select('id, name, code')
      .eq('parent_id', existingSession.selected_category_id)
      .order('code')

    const selected = subcategories?.[choice - 1]

    if (!selected) {
      return NextResponse.json({
        success: true,
        reply: 'Invalid option. Please choose a number from the list.',
      })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        selected_category_id: selected.id,
        current_step: 'description',
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingSession.id)

    return NextResponse.json({
      success: true,
      reply: 'Description?',
    })
  }

  if (existingSession.current_step === 'description') {
    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        description: messageText,
        current_step: 'confirm',
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingSession.id)

    const { data: category } = await supabase
      .from('categories')
      .select('name')
      .eq('id', existingSession.selected_category_id)
      .single()

    return NextResponse.json({
      success: true,
      reply:
        `Confirm expense:\n` +
        `Amount: USD ${existingSession.amount}\n` +
        `Category: ${category?.name}\n` +
        `Description: ${messageText}\n\n` +
        `Reply YES to save or NO to cancel.`,
    })
  }

  if (existingSession.current_step === 'confirm') {
    const answer = messageText.toLowerCase()

    if (answer === 'yes') {
      await supabase.from('transactions').insert({
        type: 'expense',
        amount: existingSession.amount,
        description: existingSession.description,
        category_id: existingSession.selected_category_id,
        source: 'whatsapp',
        transaction_date: new Date().toISOString().slice(0, 10),
      })

      await supabase
        .from('whatsapp_expense_sessions')
        .update({
          is_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSession.id)

      return NextResponse.json({
        success: true,
        reply: 'Expense saved ✅',
      })
    }

    if (answer === 'no') {
      await supabase
        .from('whatsapp_expense_sessions')
        .update({
          is_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSession.id)

      return NextResponse.json({
        success: true,
        reply: 'Expense canceled.',
      })
    }

    return NextResponse.json({
      success: true,
      reply: 'Please reply YES to save or NO to cancel.',
    })
  }

  return NextResponse.json({
    success: true,
    reply: 'Amount?',
  })
}