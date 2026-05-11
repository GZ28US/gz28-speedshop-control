import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const INSTANCE_ID = 'instance174454'
const TOKEN = 'tcp7wqrfc5koodt3'
const GROUP_ID = '120363425950692194@g.us'
const POLLING_ID = 'gz28us-expenses'

async function sendMessage(text: string) {
  await fetch(`https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: TOKEN,
      to: GROUP_ID,
      body: text,
    }),
  })
}

function parseAmount(text: string) {
  const cleaned = text.replace(/usd/gi, '').replace(/\$/g, '').trim()
  const amount = Number(cleaned)
  return Number.isFinite(amount) ? amount : null
}

export async function GET() {
  const response = await fetch(
    `https://api.ultramsg.com/${INSTANCE_ID}/chats/messages?token=${TOKEN}&chatId=${GROUP_ID}&limit=10`
  )

  const messages = await response.json()

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ success: true, message: 'No messages found' })
  }

  const latestMessage = messages.find((message: any) => {
  const body = String(message.body || '').trim()

  const botMessages = [
    'Amount?',
    'Please send a valid amount. Example: USD 150',
    'Choose main category:',
    'Choose subcategory:',
    'Description?',
    'Confirm expense:',
    'Expense saved',
    'Expense canceled',
  ]

  return (
    body &&
    !botMessages.some(botText => body.startsWith(botText))
  )
})
  const messageId = latestMessage.id
  const text = latestMessage.body?.trim() || ''
  const normalizedText = text.toLowerCase()

  const { data: state } = await supabase
    .from('whatsapp_polling_state')
    .select('*')
    .eq('id', POLLING_ID)
    .single()

  if (state?.last_message_id === messageId) {
    return NextResponse.json({ success: true, message: 'No new messages' })
  }

  await supabase
    .from('whatsapp_polling_state')
    .update({ last_message_id: messageId, updated_at: new Date().toISOString() })
    .eq('id', POLLING_ID)

  const { data: session } = await supabase
    .from('whatsapp_expense_sessions')
    .select('*')
    .eq('phone_number', GROUP_ID)
    .eq('is_completed', false)
    .maybeSingle()

  if (!session) {
    if (normalizedText !== 'expense') {
      return NextResponse.json({ success: true, message: 'Message ignored', body: text })
    }

    await supabase.from('whatsapp_expense_sessions').insert({
      phone_number: GROUP_ID,
      current_step: 'amount',
    })

    await sendMessage('Amount?')
    return NextResponse.json({ success: true, message: 'Started expense flow' })
  }

  if (session.current_step === 'amount') {
    const amount = parseAmount(text)

    if (!amount) {
      await sendMessage('Please send a valid amount. Example: USD 150')
      return NextResponse.json({ success: true, message: 'Invalid amount' })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({ amount, current_step: 'main_category' })
      .eq('id', session.id)

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, code')
      .eq('type', 'expense')
      .is('parent_id', null)
      .order('code')

    await sendMessage(
      'Choose main category:\n' +
        categories?.map((c, i) => `${i + 1}. ${c.name}`).join('\n')
    )

    return NextResponse.json({ success: true, message: 'Asked category' })
  }

  if (session.current_step === 'main_category') {
    const choice = Number(text)

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, code')
      .eq('type', 'expense')
      .is('parent_id', null)
      .order('code')

    const selected = categories?.[choice - 1]

    if (!selected) {
      await sendMessage('Invalid option. Please choose a number from the list.')
      return NextResponse.json({ success: true, message: 'Invalid main category' })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        selected_category_id: selected.id,
        current_step: 'subcategory',
      })
      .eq('id', session.id)

    const { data: subcategories } = await supabase
      .from('categories')
      .select('id, name, code')
      .eq('parent_id', selected.id)
      .order('code')

    if (!subcategories || subcategories.length === 0) {
      await supabase
        .from('whatsapp_expense_sessions')
        .update({ current_step: 'description' })
        .eq('id', session.id)

      await sendMessage('Description?')
      return NextResponse.json({ success: true, message: 'Asked description' })
    }

    await sendMessage(
      'Choose subcategory:\n' +
        subcategories.map((c, i) => `${i + 1}. ${c.name}`).join('\n')
    )

    return NextResponse.json({ success: true, message: 'Asked subcategory' })
  }

  if (session.current_step === 'subcategory') {
    const choice = Number(text)

    const { data: subcategories } = await supabase
      .from('categories')
      .select('id, name, code')
      .eq('parent_id', session.selected_category_id)
      .order('code')

    const selected = subcategories?.[choice - 1]

    if (!selected) {
      await sendMessage('Invalid option. Please choose a number from the list.')
      return NextResponse.json({ success: true, message: 'Invalid subcategory' })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        selected_category_id: selected.id,
        current_step: 'description',
      })
      .eq('id', session.id)

    await sendMessage('Description?')
    return NextResponse.json({ success: true, message: 'Asked description' })
  }

  if (session.current_step === 'description') {
    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        description: text,
        current_step: 'confirm',
      })
      .eq('id', session.id)

    const { data: category } = await supabase
      .from('categories')
      .select('name')
      .eq('id', session.selected_category_id)
      .single()

    await sendMessage(
      `Confirm expense:\n` +
        `Amount: USD ${session.amount}\n` +
        `Category: ${category?.name}\n` +
        `Description: ${text}\n\n` +
        `Reply YES to save or NO to cancel.`
    )

    return NextResponse.json({ success: true, message: 'Asked confirmation' })
  }

  if (session.current_step === 'confirm') {
    if (normalizedText === 'yes') {
      await supabase.from('transactions').insert({
        type: 'expense',
        amount: session.amount,
        description: session.description,
        category_id: session.selected_category_id,
        source: 'whatsapp-group-polling',
        transaction_date: new Date().toISOString().slice(0, 10),
      })

      await supabase
        .from('whatsapp_expense_sessions')
        .update({ is_completed: true })
        .eq('id', session.id)

      await sendMessage('Expense saved ✅')
      return NextResponse.json({ success: true, message: 'Expense saved' })
    }

    if (normalizedText === 'no') {
      await supabase
        .from('whatsapp_expense_sessions')
        .update({ is_completed: true })
        .eq('id', session.id)

      await sendMessage('Expense canceled.')
      return NextResponse.json({ success: true, message: 'Expense canceled' })
    }

    await sendMessage('Please reply YES to save or NO to cancel.')
    return NextResponse.json({ success: true, message: 'Waiting confirmation' })
  }

  return NextResponse.json({ success: true, message: 'No action' })
}