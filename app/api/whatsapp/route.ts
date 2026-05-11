import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const INSTANCE_ID = 'instance174454'
const TOKEN = 'tcp7wqrfc5koodt3'
const EXPENSE_GROUP_ID = '120363425950692194@g.us'

async function sendWhatsAppMessage(body: string) {
  await fetch(`https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: TOKEN,
      to: EXPENSE_GROUP_ID,
      body,
    }),
  })
}

function parseAmount(text: string) {
  const cleaned = text
    .replace(/usd/gi, '')
    .replace(/\$/g, '')
    .replace(/,/g, '')
    .trim()

  const amount = Number(cleaned)

  return Number.isFinite(amount) && amount > 0 ? amount : null
}

export async function POST(request: Request) {
  const body = await request.json()

  const messageText =
    body.data?.body ||
    body.message_text ||
    body.text ||
    body.message ||
    ''

  const from =
    body.data?.from ||
    body.sender_phone ||
    body.phone ||
    EXPENSE_GROUP_ID

  const normalizedText = messageText.trim().toLowerCase()

  if (from !== EXPENSE_GROUP_ID) {
    return NextResponse.json({ success: true })
  }

  const { data: existingSession } = await supabase
    .from('whatsapp_expense_sessions')
    .select('*')
    .eq('phone_number', EXPENSE_GROUP_ID)
    .eq('is_completed', false)
    .maybeSingle()

  if (!existingSession) {
    if (normalizedText !== 'expense') {
      return NextResponse.json({ success: true })
    }

    await supabase.from('whatsapp_expense_sessions').insert({
      phone_number: EXPENSE_GROUP_ID,
      current_step: 'amount',
    })

    await sendWhatsAppMessage('Amount?')

    return NextResponse.json({ success: true })
  }

  if (existingSession.current_step === 'amount') {
    const amount = parseAmount(messageText)

    if (!amount) {
      await sendWhatsAppMessage('Please send a valid amount. Example: USD 150')
      return NextResponse.json({ success: true })
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
      .select('id, name, code')
      .eq('type', 'expense')
      .is('parent_id', null)
      .order('code')

    await sendWhatsAppMessage(
      'Choose main category:\n' +
        categories?.map((c, i) => `${i}. ${c.name}`).join('\n')
    )

    return NextResponse.json({ success: true })
  }

  if (existingSession.current_step === 'main_category') {
    const choice = Number(messageText)

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, code')
      .eq('type', 'expense')
      .is('parent_id', null)
      .order('code')

    const selected = categories?.[choice]

    if (!selected) {
      await sendWhatsAppMessage('Invalid option. Please choose a number from the list.')
      return NextResponse.json({ success: true })
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
      .select('id, name, code')
      .eq('parent_id', selected.id)
      .order('name')

    if (!subcategories || subcategories.length === 0) {
      await supabase
        .from('whatsapp_expense_sessions')
        .update({
          current_step: 'description',
        })
        .eq('id', existingSession.id)

      await sendWhatsAppMessage('Description?')

      return NextResponse.json({ success: true })
    }

    await sendWhatsAppMessage(
      'Choose subcategory:\n' +
        subcategories.map((c, i) => `${i}. ${c.name}`).join('\n')
    )

    return NextResponse.json({ success: true })
  }

  if (existingSession.current_step === 'subcategory') {
    const choice = Number(messageText)

    const { data: subcategories } = await supabase
      .from('categories')
      .select('id, name, code')
      .eq('parent_id', existingSession.selected_category_id)
      .order('name')

    const selected = subcategories?.[choice]

    if (!selected) {
      await sendWhatsAppMessage('Invalid option. Please choose a number from the list.')
      return NextResponse.json({ success: true })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        selected_category_id: selected.id,
        current_step: 'description',
      })
      .eq('id', existingSession.id)

    await sendWhatsAppMessage('Description?')

    return NextResponse.json({ success: true })
  }

  if (existingSession.current_step === 'description') {
    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        description: messageText,
        current_step: 'confirm',
      })
      .eq('id', existingSession.id)

    const { data: category } = await supabase
      .from('categories')
      .select('name')
      .eq('id', existingSession.selected_category_id)
      .single()

    await sendWhatsAppMessage(
      `Confirm expense:\n` +
        `Amount: USD ${existingSession.amount}\n` +
        `Category: ${category?.name}\n` +
        `Description: ${messageText}\n\n` +
        `Reply YES to save or NO to cancel.`
    )

    return NextResponse.json({ success: true })
  }

  if (existingSession.current_step === 'confirm') {
    if (normalizedText === 'yes') {
      await supabase.from('transactions').insert({
        type: 'expense',
        amount: existingSession.amount,
        description: existingSession.description,
        category_id: existingSession.selected_category_id,
        source: 'whatsapp-group',
        transaction_date: new Date().toISOString().slice(0, 10),
      })

      await supabase
        .from('whatsapp_expense_sessions')
        .update({
          is_completed: true,
        })
        .eq('id', existingSession.id)

      await sendWhatsAppMessage('Expense saved ✅')

      return NextResponse.json({ success: true })
    }

    if (normalizedText === 'no') {
      await supabase
        .from('whatsapp_expense_sessions')
        .update({
          is_completed: true,
        })
        .eq('id', existingSession.id)

      await sendWhatsAppMessage('Expense canceled.')

      return NextResponse.json({ success: true })
    }

    await sendWhatsAppMessage('Please reply YES to save or NO to cancel.')

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: true })
}