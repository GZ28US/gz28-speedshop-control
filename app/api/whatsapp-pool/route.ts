import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const INSTANCE_ID = 'instance174454'
const TOKEN = 'tcp7wqrfc5koodt3'
const GROUP_ID = '120363425950692194@g.us'

async function sendMessage(text: string) {
  await fetch(
    `https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: TOKEN,
        to: GROUP_ID,
        body: text,
      }),
    }
  )
}

export async function GET() {
  try {
    const response = await fetch(
      `https://api.ultramsg.com/${INSTANCE_ID}/chats/messages?token=${TOKEN}&chatId=${GROUP_ID}&limit=10`
    )

    const messages = await response.json()

    if (!Array.isArray(messages)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid messages response',
      })
    }

    const latestMessage = messages[0]

    if (!latestMessage) {
      return NextResponse.json({
        success: true,
        message: 'No messages found',
      })
    }

    const messageId = latestMessage.id
    const body = latestMessage.body?.trim()

    const { data: pollingState } = await supabase
      .from('whatsapp_polling_state')
      .select('*')
      .eq('id', 'gz28us-expenses')
      .single()

    if (pollingState?.last_message_id === messageId) {
      return NextResponse.json({
        success: true,
        message: 'No new messages',
      })
    }

    await supabase
      .from('whatsapp_polling_state')
      .update({
        last_message_id: messageId,
      })
      .eq('id', 'gz28us-expenses')

    if (body?.toUpperCase() === 'EXPENSE') {
      await sendMessage('Amount?')

      return NextResponse.json({
        success: true,
        message: 'Expense flow started',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Message ignored',
      body,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    })
  }
}