# Update `route.ts` for UltraMsg replies

Replace your current `route.ts` with this version.

```ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const INSTANCE_ID = 'instance174454'
const TOKEN = 'tcp7wqrfc5koodt3'

async function sendWhatsAppMessage(to: string, body: string) {
  await fetch(
    `https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: TOKEN,
        to,
        body,
      }),
    }
  )
}

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
    body.data?.body ||
    body.message_text ||
    body.text ||
    ''

  const senderPhone =
    body.data?.from ||
    body.sender_phone ||
    body.phone ||
    ''

  const normalizedText = messageText
    .trim()
    .toLowerCase()

  const { data: existingSession } = await supabase
    .from('whatsapp_expense_sessions')
    .select('*')
    .eq('phone_number', senderPhone)
    .eq('is_completed', false)
    .maybeSingle()

  // START FLOW
  if (!existingSession) {
    if (normalizedText !== 'expense') {
      return NextResponse.json({ success: true })
    }

    await supabase
      .from('whatsapp_expense_sessions')
      .insert({
        phone_number: senderPhone,
        current_step: 'amount',
      })

    await sendWhatsAppMessage(senderPhone, 'Amount?')

    return NextResponse.json({ success: true })
  }

  // AMOUNT STEP
  if (existingSession.current_step === 'amount') {
    const amount = parseAmount(messageText)

    if (!amount) {
      await sendWhatsAppMessage(
        senderPhone,
        'Please send a valid amount. Example: USD 150'
      )

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
      .select('id, name')
      .eq('type', 'expense')
      .is('parent_id', null)

    const reply =
      'Choose main category:\n' +
      categories
        ?.map((c, i) => `${i + 1}. ${c.name}`)
        .join('\n')

    await sendWhatsAppMessage(senderPhone, reply)

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: true })
}
```

Save the file.

Then run:

```powershell
git add .
git commit -m "Connect UltraMsg replies"
git push
```

Wait about 1 minute for Vercel redeployment.

Then test in the WhatsApp group:

```text
EXPENSE
```
