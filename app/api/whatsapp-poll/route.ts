import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const INSTANCE_ID = 'instance174454'
const TOKEN = 'tcp7wqrfc5koodt3'
const GROUP_ID = '120363425950692194@g.us'

async function sendMessage(text: string) {
  const response = await fetch(`https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: TOKEN,
      to: GROUP_ID,
      body: text,
    }),
  })

  const resultText = await response.text()

  return {
    ok: response.ok,
    status: response.status,
    body: resultText,
  }
}

function parseAmount(text: string) {
  const amount = Number(
    text.replace(/usd/gi, '').replace(/\$/g, '').replace(/,/g, '').trim()
  )

  return Number.isFinite(amount) && amount > 0 ? amount : null
}

function isBotMessage(body: string) {
  return [
    'Amount?',
    'Please send a valid amount. Example: USD 150',
    'Choose main category:',
    'Choose subcategory:',
    'Description?',
    'Confirm expense:',
    'Expense saved',
    'Expense canceled.',
    'Please reply YES to save or NO to cancel.',
    'Invalid option. Please choose a number from the list.',
  ].some((text) => body.startsWith(text))
}

async function wasProcessed(messageId: string) {
  const { data } = await supabase
    .from('whatsapp_processed_messages')
    .select('message_id')
    .eq('message_id', messageId)
    .maybeSingle()

  return Boolean(data)
}

async function markProcessed(messageId: string) {
  await supabase
    .from('whatsapp_processed_messages')
    .upsert({ message_id: messageId })
}

async function getChildren(parentId: string) {
  const { data } = await supabase
    .from('categories')
    .select('id, name, code')
    .eq('parent_id', parentId)
    .order('code')

  return data || []
}

export async function GET() {
  const response = await fetch(
    `https://api.ultramsg.com/${INSTANCE_ID}/chats/messages?token=${TOKEN}&chatId=${GROUP_ID}&limit=20`
  )

  const messages = await response.json()

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ success: true, message: 'No messages found' })
  }

  const userMessages = messages
    .filter((message: any) => {
      const body = String(message.body || '').trim()
      return message.id && body && !isBotMessage(body)
    })
    .sort((a: any, b: any) => Number(b.timestamp || 0) - Number(a.timestamp || 0))

  let nextMessage: any = null

  for (const message of userMessages) {
    const processed = await wasProcessed(message.id)
    if (!processed) {
      nextMessage = message
      break
    }
  }

  if (!nextMessage) {
    return NextResponse.json({ success: true, message: 'No new messages' })
  }

  const messageId = nextMessage.id
  const text = String(nextMessage.body || '').trim()
  const normalizedText = text.toLowerCase()

  const { data: session } = await supabase
    .from('whatsapp_expense_sessions')
    .select('*')
    .eq('phone_number', GROUP_ID)
    .eq('is_completed', false)
    .maybeSingle()

  if (!session) {
    if (normalizedText !== 'expense') {
      await markProcessed(messageId)
      return NextResponse.json({ success: true, message: 'Message ignored', body: text })
    }

    await supabase.from('whatsapp_expense_sessions').insert({
      phone_number: GROUP_ID,
      current_step: 'amount',
    })

    const send = await sendMessage('Amount?')
    await markProcessed(messageId)

    return NextResponse.json({
      success: true,
      message: 'Started expense flow',
      sent: send,
    })
  }

  if (session.current_step === 'amount') {
    if (normalizedText === 'expense') {
      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Ignored duplicate EXPENSE trigger while waiting for amount',
      })
    }

    const amount = parseAmount(text)

    if (!amount) {
      const send = await sendMessage('Please send a valid amount. Example: USD 150')
      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Invalid amount',
        body: text,
        sent: send,
      })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        amount,
        current_step: 'main_category',
      })
      .eq('id', session.id)

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, code')
      .eq('type', 'expense')
      .is('parent_id', null)
      .order('code')

    const send = await sendMessage(
      'Choose main category:\n' +
        categories?.map((c, i) => `${i}. ${c.name}`).join('\n')
    )

    await markProcessed(messageId)

    return NextResponse.json({
      success: true,
      message: 'Asked category',
      sent: send,
    })
  }

  if (session.current_step === 'main_category') {
    const choice = Number(text)

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, code')
      .eq('type', 'expense')
      .is('parent_id', null)
      .order('code')

    const selected = categories?.[choice]

    if (!selected) {
      const send = await sendMessage('Invalid option. Please choose a number from the list.')
      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Invalid main category',
        body: text,
        sent: send,
      })
    }

    const children = await getChildren(selected.id)

    if (children.length > 0) {
      await supabase
        .from('whatsapp_expense_sessions')
        .update({
          selected_category_id: selected.id,
          current_step: 'subcategory',
        })
        .eq('id', session.id)

      const send = await sendMessage(
        'Choose subcategory:\n' +
          children.map((c, i) => `${i}. ${c.name}`).join('\n')
      )

      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Asked subcategory',
        sent: send,
      })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        selected_category_id: selected.id,
        current_step: 'description',
      })
      .eq('id', session.id)

    const send = await sendMessage('Description?')
    await markProcessed(messageId)

    return NextResponse.json({
      success: true,
      message: 'Asked description',
      sent: send,
    })
  }

  if (session.current_step === 'subcategory') {
    const choice = Number(text)

    const subcategories = await getChildren(session.selected_category_id)

    const selected = subcategories?.[choice]

    if (!selected) {
      const send = await sendMessage('Invalid option. Please choose a number from the list.')
      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Invalid subcategory',
        body: text,
        sent: send,
      })
    }

    const children = await getChildren(selected.id)

    if (children.length > 0) {
      await supabase
        .from('whatsapp_expense_sessions')
        .update({
          selected_category_id: selected.id,
          current_step: 'subcategory',
        })
        .eq('id', session.id)

      const send = await sendMessage(
        'Choose subcategory:\n' +
          children.map((c, i) => `${i}. ${c.name}`).join('\n')
      )

      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Asked nested subcategory',
        sent: send,
      })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        selected_category_id: selected.id,
        current_step: 'description',
      })
      .eq('id', session.id)

    const send = await sendMessage('Description?')
    await markProcessed(messageId)

    return NextResponse.json({
      success: true,
      message: 'Asked description',
      sent: send,
    })
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

    const send = await sendMessage(
      `Confirm expense:\n` +
        `Amount: USD ${session.amount}\n` +
        `Category: ${category?.name}\n` +
        `Description: ${text}\n\n` +
        `Reply YES to save or NO to cancel.`
    )

    await markProcessed(messageId)

    return NextResponse.json({
      success: true,
      message: 'Asked confirmation',
      sent: send,
    })
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
        .update({
          is_completed: true,
        })
        .eq('id', session.id)

      const send = await sendMessage('Expense saved ✅')
      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Expense saved',
        sent: send,
      })
    }

    if (normalizedText === 'no') {
      await supabase
        .from('whatsapp_expense_sessions')
        .update({
          is_completed: true,
        })
        .eq('id', session.id)

      const send = await sendMessage('Expense canceled.')
      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Expense canceled',
        sent: send,
      })
    }

    const send = await sendMessage('Please reply YES to save or NO to cancel.')
    await markProcessed(messageId)

    return NextResponse.json({
      success: true,
      message: 'Waiting confirmation',
      body: text,
      sent: send,
    })
  }

  await markProcessed(messageId)

  return NextResponse.json({
    success: true,
    message: 'No action',
  })
}