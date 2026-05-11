import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function parseAmount(text: string) {
  const cleaned = text
    .replace(/usd/gi, '')
    .replace(/\$/g, '')
    .trim()

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

  const normalizedText =
    messageText.trim().toLowerCase()

  const { data: existingSession } = await supabase
    .from('whatsapp_expense_sessions')
    .select('*')
    .eq('phone_number', senderPhone)
    .eq('is_completed', false)
    .maybeSingle()

  // START FLOW
  if (!existingSession) {
    if (normalizedText !== 'expense') {
      return NextResponse.json({
        success: true,
        reply: 'Send EXPENSE to register a new expense.',
      })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .insert({
        phone_number: senderPhone,
        current_step: 'amount',
      })

    return NextResponse.json({
      success: true,
      reply: 'Amount?',
    })
  }

  // AMOUNT STEP
  if (existingSession.current_step === 'amount') {
    const amount = parseAmount(messageText)

    if (!amount) {
      return NextResponse.json({
        success: true,
        reply:
          'Please send a valid amount. Example: USD 150',
      })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        amount,
        current_step: 'main_category',
      })
      .eq('id', existingSession.id)

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name')
      .eq('type', 'expense')
      .is('parent_id', null)

    return NextResponse.json({
      success: true,
      reply:
        'Choose main category:\n' +
        categories
          ?.map((c, i) => `${i + 1}. ${c.name}`)
          .join('\n'),
    })
  }

  // MAIN CATEGORY STEP
  if (existingSession.current_step === 'main_category') {
    const choice = Number(messageText)

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name')
      .eq('type', 'expense')
      .is('parent_id', null)

    const selected = categories?.[choice - 1]

    if (!selected) {
      return NextResponse.json({
        success: true,
        reply: 'Invalid option.',
      })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        selected_category_id: selected.id,
        current_step: 'subcategory',
      })
      .eq('id', existingSession.id)

    const { data: subcategories } = await supabase
      .from('categories')
      .select('id, name')
      .eq('parent_id', selected.id)

    return NextResponse.json({
      success: true,
      reply:
        'Choose subcategory:\n' +
        subcategories
          ?.map((c, i) => `${i + 1}. ${c.name}`)
          .join('\n'),
    })
  }

  // SUBCATEGORY STEP
  if (existingSession.current_step === 'subcategory') {
    const choice = Number(messageText)

    const { data: subcategories } = await supabase
      .from('categories')
      .select('id, name')
      .eq(
        'parent_id',
        existingSession.selected_category_id
      )

    const selected = subcategories?.[choice - 1]

    if (!selected) {
      return NextResponse.json({
        success: true,
        reply: 'Invalid option.',
      })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        selected_category_id: selected.id,
        current_step: 'description',
      })
      .eq('id', existingSession.id)

    return NextResponse.json({
      success: true,
      reply: 'Description?',
    })
  }

  // DESCRIPTION STEP
  if (existingSession.current_step === 'description') {
    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        description: messageText,
        current_step: 'confirm',
      })
      .eq('id', existingSession.id)

    return NextResponse.json({
      success: true,
      reply:
        `Confirm expense:\n\n` +
        `Amount: USD ${existingSession.amount}\n` +
        `Description: ${messageText}\n\n` +
        `Reply YES to save.`,
    })
  }

  // CONFIRM STEP
  if (existingSession.current_step === 'confirm') {
    if (normalizedText !== 'yes') {
      return NextResponse.json({
        success: true,
        reply: 'Reply YES to confirm.',
      })
    }

    await supabase
      .from('transactions')
      .insert({
        type: 'expense',
        amount: existingSession.amount,
        description: existingSession.description,
        category_id:
          existingSession.selected_category_id,
        source: 'whatsapp',
        transaction_date: new Date()
          .toISOString()
          .slice(0, 10),
      })

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        is_completed: true,
      })
      .eq('id', existingSession.id)

    return NextResponse.json({
      success: true,
      reply: 'Expense saved ✅',
    })
  }

  return NextResponse.json({
    success: true,
    reply: 'Send EXPENSE to begin.',
  })
}