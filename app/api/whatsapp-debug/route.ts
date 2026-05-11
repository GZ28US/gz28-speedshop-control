import { NextResponse } from 'next/server'

const INSTANCE_ID = 'instance174454'
const TOKEN = 'tcp7wqrfc5koodt3'
const GROUP_ID = '120363425950692194@g.us'

export async function GET() {
  const response = await fetch(
    `https://api.ultramsg.com/${INSTANCE_ID}/chats/messages?token=${TOKEN}&chatId=${GROUP_ID}&limit=10`
  )

  const messages = await response.json()

  return NextResponse.json({
    success: true,
    count: Array.isArray(messages) ? messages.length : null,
    messages: Array.isArray(messages)
      ? messages.map((m: any, index: number) => ({
          index,
          id: m.id,
          body: m.body,
          from: m.from,
          to: m.to,
          author: m.author,
          fromMe: m.fromMe,
          type: m.type,
          timestamp: m.timestamp,
          time: m.time,
          date: m.date,
        }))
      : messages,
  })
}