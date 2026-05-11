console.log('WORKER VERSION 2')
const POLL_URL = 'https://gz28-speedshop-control.vercel.app/api/whatsapp-poll'

async function run() {
  try {
    const response = await fetch(POLL_URL)
    const data = await response.json()
    console.log(new Date().toISOString(), data)
  } catch (error) {
    console.error(new Date().toISOString(), error)
  }
}

console.log('GZ28 WhatsApp worker started')

setInterval(run, 5000)
run()