import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const INSTANCE_ID = 'instance174454'
const TOKEN = 'zrc6hvwki3g2w4ok'
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

function isReceiptMessage(message: any) {
  const type = String(message?.type || '').toLowerCase()

  return (
    type === 'image' ||
    type === 'document' ||
    type === 'pdf' ||
    type === 'file'
  )
}

function getReceiptFileUrl(message: any) {
  if (!isReceiptMessage(message)) return null

  return (
    message.media ||
    message.mediaUrl ||
    message.url ||
    message.document ||
    message.file ||
    null
  )
}

function isBotMessage(body: string) {
  return [
    'Transaction date is today?',
    'Today?',
    'Day?',
    'Month?',
    'Year?',
    'Amount?',
    'Receipt attached',
    'Please reply YES or NO.',
    'Invalid day.',
    'Invalid month.',
    'Invalid year.',
    'Please send a valid amount. Example: USD 150',
    'Choose main category:',
    'Choose subcategory:',
    'Description?',
    'Confirm expense:',
    'Expense saved',
    'Expense canceled.',
    'Please reply S to save or C to cancel.',
    'Invalid option. Please choose a number from the list.',
    'Invalid option. Please choose a number from the list, or C to cancel.',
  ].some((botText) => body.startsWith(botText))
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

async function cancelSession(sessionId: string, messageId: string) {
  await supabase
    .from('whatsapp_expense_sessions')
    .update({
      is_completed: true,
    })
    .eq('id', sessionId)

  const send = await sendMessage('Expense canceled.')
  await markProcessed(messageId)

  return NextResponse.json({
    success: true,
    message: 'Expense canceled',
    sent: send,
  })
}

function menuWithCancel(title: string, items: any[]) {
  return (
    `${title}\n` +
    items.map((c, i) => `${i}. ${c.name}`).join('\n') +
    '\n\nC. CANCEL'
  )
}

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

function buildDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function isValidDate(year: number, month: number, day: number) {
  const date = new Date(`${buildDate(year, month, day)}T00:00:00Z`)

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  )
}

export async function GET() {
  const response = await fetch(
    `https://api.ultramsg.com/${INSTANCE_ID}/chats/messages?token=${TOKEN}&chatId=${GROUP_ID}&limit=20`
  )

  const messages = await response.json()

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({
      success: true,
      message: 'No messages found',
    })
  }

  const userMessages = messages
    .filter((message: any) => {
      const body = String(message.body || '').trim()
      const isReceipt = isReceiptMessage(message)

      if (message.fromMe === true && !message.author) {
        return false
      }

      return (
        message.id &&
        (
          isReceipt ||
          (body && !isBotMessage(body))
        )
      )
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
    return NextResponse.json({
      success: true,
      message: 'No new messages',
    })
  }

  const messageId = nextMessage.id

  const alreadyProcessed = await wasProcessed(messageId)

  if (alreadyProcessed) {
    return NextResponse.json({
      success: true,
      message: 'Message already processed',
    })
  }

  const text = String(nextMessage.body || '').trim()
  const normalizedText = text.toLowerCase()
  const receiptFileUrl = getReceiptFileUrl(nextMessage)
  const isReceiptTrigger = isReceiptMessage(nextMessage)

  const { data: sessions } = await supabase
    .from('whatsapp_expense_sessions')
    .select('*')
    .eq('phone_number', GROUP_ID)
    .eq('is_completed', false)
    .order('created_at', { ascending: false })
    .limit(1)

  const session = sessions?.[0]

  if (session && normalizedText === 'c') {
    return await cancelSession(session.id, messageId)
  }

  if (!session) {
    if (normalizedText !== 'expense' && !isReceiptTrigger) {
      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Message ignored',
        body: text,
      })
    }

    await supabase.from('whatsapp_expense_sessions').insert({
      phone_number: GROUP_ID,
      current_step: 'today_question',
      selected_category_path: null,
      receipt_file_url: receiptFileUrl,
    })

    const send = await sendMessage(
      isReceiptTrigger
        ? 'Receipt attached ✅\nTransaction date is today? Reply YES or NO'
        : 'Transaction date is today? Reply YES or NO'
    )

    await markProcessed(messageId)

    return NextResponse.json({
      success: true,
      message: 'Started expense flow',
      sent: send,
    })
  }

  if (isReceiptTrigger) {
    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        receipt_file_url: receiptFileUrl,
      })
      .eq('id', session.id)

    await markProcessed(messageId)

    return NextResponse.json({
      success: true,
      message: 'Receipt attached silently',
      receipt_file_url: receiptFileUrl,
    })
  }

  if (session.current_step === 'today_question') {
    if (normalizedText === 'yes') {
      await supabase
        .from('whatsapp_expense_sessions')
        .update({
          transaction_date: todayDate(),
          current_step: 'amount',
        })
        .eq('id', session.id)

      const send = await sendMessage('Amount?')
      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Using today date',
        sent: send,
      })
    }

    if (normalizedText === 'no') {
      await supabase
        .from('whatsapp_expense_sessions')
        .update({
          current_step: 'custom_day',
        })
        .eq('id', session.id)

      const send = await sendMessage('Day?')
      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Asked day',
        sent: send,
      })
    }

    const send = await sendMessage('Please reply YES or NO.')
    await markProcessed(messageId)

    return NextResponse.json({
      success: true,
      message: 'Waiting today confirmation',
      body: text,
      sent: send,
    })
  }

  if (session.current_step === 'custom_day') {
    const day = Number(text)

    if (!Number.isInteger(day) || day < 1 || day > 31) {
      const send = await sendMessage('Invalid day. Please send a number between 1 and 31.')
      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Invalid day',
        body: text,
        sent: send,
      })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        transaction_day: day,
        current_step: 'custom_month',
      })
      .eq('id', session.id)

    const send = await sendMessage('Month?')
    await markProcessed(messageId)

    return NextResponse.json({
      success: true,
      message: 'Asked month',
      sent: send,
    })
  }

  if (session.current_step === 'custom_month') {
    const month = Number(text)

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      const send = await sendMessage('Invalid month. Please send a number between 1 and 12.')
      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Invalid month',
        body: text,
        sent: send,
      })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        transaction_month: month,
        current_step: 'custom_year',
      })
      .eq('id', session.id)

    const send = await sendMessage('Year?')
    await markProcessed(messageId)

    return NextResponse.json({
      success: true,
      message: 'Asked year',
      sent: send,
    })
  }

  if (session.current_step === 'custom_year') {
    const year = Number(text)
    const day = Number(session.transaction_day)
    const month = Number(session.transaction_month)

    if (!Number.isInteger(year) || year < 2020 || year > 2100) {
      const send = await sendMessage('Invalid year. Please send a valid year.')
      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Invalid year',
        body: text,
        sent: send,
      })
    }

    if (!isValidDate(year, month, day)) {
      const send = await sendMessage('Invalid date. Please cancel with C and start again.')
      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Invalid full date',
        sent: send,
      })
    }

    const finalDate = buildDate(year, month, day)

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        transaction_year: year,
        transaction_date: finalDate,
        current_step: 'amount',
      })
      .eq('id', session.id)

    const send = await sendMessage('Amount?')
    await markProcessed(messageId)

    return NextResponse.json({
      success: true,
      message: 'Custom date saved',
      sent: send,
    })
  }

  if (session.current_step === 'amount') {
    const amount = parseAmount(text)

    if (!amount) {
      const send = await sendMessage(
        'Please send a valid amount. Example: USD 150'
      )

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
      menuWithCancel('Choose main category:', categories || [])
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
      const send = await sendMessage(
        'Invalid option. Please choose a number from the list, or C to cancel.'
      )

      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Invalid main category',
        body: text,
        sent: send,
      })
    }

    const children = await getChildren(selected.id)
    const selectedPath = selected.name

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        selected_category_id: selected.id,
        selected_category_path: selectedPath,
        current_step: children.length > 0 ? 'subcategory' : 'description',
      })
      .eq('id', session.id)

    if (children.length > 0) {
      const send = await sendMessage(
        menuWithCancel('Choose subcategory:', children)
      )

      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Asked subcategory',
        sent: send,
      })
    }

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
      const send = await sendMessage(
        'Invalid option. Please choose a number from the list, or C to cancel.'
      )

      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Invalid subcategory',
        body: text,
        sent: send,
      })
    }

    const previousPath = session.selected_category_path || ''
    const selectedPath = previousPath
      ? `${previousPath} > ${selected.name}`
      : selected.name

    const children = await getChildren(selected.id)

    await supabase
      .from('whatsapp_expense_sessions')
      .update({
        selected_category_id: selected.id,
        selected_category_path: selectedPath,
        current_step: children.length > 0 ? 'subcategory' : 'description',
      })
      .eq('id', session.id)

    if (children.length > 0) {
      const send = await sendMessage(
        menuWithCancel('Choose subcategory:', children)
      )

      await markProcessed(messageId)

      return NextResponse.json({
        success: true,
        message: 'Asked nested subcategory',
        sent: send,
      })
    }

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

    const categoryText =
      session.selected_category_path ||
      category?.name ||
      'Uncategorized'

    const receiptLine = session.receipt_file_url
      ? `Receipt: Attached ✅\n`
      : ''

    const dateLine = session.transaction_date
      ? `Date: ${session.transaction_date}\n`
      : ''

    const send = await sendMessage(
      `Confirm expense:\n` +
      `Amount: USD ${session.amount}\n` +
      dateLine +
      `Category: ${categoryText}\n` +
      receiptLine +
      `Description: ${text}\n\n` +
      `Reply S to save or C to cancel.`
    )

    await markProcessed(messageId)

    return NextResponse.json({
      success: true,
      message: 'Asked confirmation',
      sent: send,
    })
  }

  if (session.current_step === 'confirm') {
    if (normalizedText === 's') {
      await supabase.from('transactions').insert({
        type: 'expense',
        amount: session.amount,
        description: session.description,
        category_id: session.selected_category_id,
        category_path: session.selected_category_path,
        receipt_file_url: session.receipt_file_url,
        source: 'whatsapp-group-polling',
        transaction_date: session.transaction_date || todayDate(),
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

    const send = await sendMessage(
      'Please reply S to save or C to cancel.'
    )

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