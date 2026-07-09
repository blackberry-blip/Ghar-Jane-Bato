import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

const defaultBuses = [
  { id: 'B1', operator: 'राजेश ट्राभल्स', from: 'दिल्ली', to: 'वीरगंज', type: 'AC स्लीपर', price: 2800, time: '१६ घण्टा', seats: 40, available: 12 },
  { id: 'B2', operator: 'हिमालय बस सेवा', from: 'दिल्ली', to: 'वीरगंज', type: 'डिलक्स', price: 2200, time: '१८ घण्टा', seats: 45, available: 8 },
  { id: 'B3', operator: 'गोरखनाथ ट्राभल्स', from: 'दिल्ली', to: 'काठमाडौं', type: 'AC स्लीपर', price: 4500, time: '२४ घण्टा', seats: 36, available: 5 },
  { id: 'B4', operator: 'पहाडी बस', from: 'दिल्ली', to: 'काठमाडौं', type: 'सोफा बस', price: 3800, time: '२६ घण्टा', seats: 32, available: 15 },
  { id: 'B5', operator: 'माया ट्राभल्स', from: 'मुंबई', to: 'काठमाडौं', type: 'AC स्लीपर', price: 5500, time: '३६ घण्टा', seats: 40, available: 7 },
  { id: 'B6', operator: 'सगरमाथा बस', from: 'बैंगलोर', to: 'काठमाडौं', type: 'AC स्लीपर', price: 6000, time: '४० घण्टा', seats: 40, available: 10 },
  { id: 'B7', operator: 'तराई एक्सप्रेस', from: 'लखनऊ', to: 'नेपालगंज', type: 'डिलक्स', price: 1800, time: '८ घण्टा', seats: 50, available: 22 },
  { id: 'B8', operator: 'बुबा-आमा ट्राभल्स', from: 'गोरखपुर', to: 'भैरहवा', type: 'साधारण', price: 1200, time: '४ घण्टा', seats: 45, available: 30 },
  { id: 'B9', operator: 'पहाडी यात्रा', from: 'सूरत', to: 'काठमाडौं', type: 'AC स्लीपर', price: 5200, time: '३८ घण्टा', seats: 40, available: 6 },
  { id: 'B10', operator: 'नेपाली सपना बस', from: 'दिल्ली', to: 'नेपालगंज', type: 'स्लीपर', price: 3200, time: '१८ घण्टा', seats: 38, available: 14 },
]

const defaultIndiaCities = ['दिल्ली', 'मुंबई', 'बैंगलोर', 'सूरत', 'हैदराबाद', 'चेन्नई', 'कोलकाता', 'पुणे', 'अहमदाबाद', 'लखनऊ', 'चंडीगढ', 'जयपुर', 'गुडगाँव', 'नोएडा', 'लुधियाना', 'अमृतसर', 'पटना', 'रांची', 'गोरखपुर']
const defaultNepalCities = ['काठमाडौं', 'वीरगंज', 'भैरहवा', 'नेपालगंज', 'काकडभिट्टा', 'धनगढी', 'महेन्द्रनगर', 'पोखरा', 'जनकपुर', 'बुटवल', 'हेटौडा', 'बिराटनगर']

export async function GET() {
  let buses = await kv.get('buses')
  if (!buses || buses.length === 0) {
    buses = defaultBuses
    await kv.set('buses', buses)
  }
  return NextResponse.json(buses)
}

export async function POST(request) {
  const body = await request.json()
  const buses = await kv.get('buses') || []
  
  const newBus = {
    id: 'B' + Date.now(),
    operator: body.operator,
    from: body.from,
    to: body.to,
    type: body.type,
    price: parseInt(body.price),
    time: body.time,
    seats: parseInt(body.seats),
    available: parseInt(body.seats)
  }
  
  buses.push(newBus)
  await kv.set('buses', buses)
  return NextResponse.json({ success: true, bus: newBus })
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  let buses = await kv.get('buses') || []
  buses = buses.filter(b => b.id !== id)
  await kv.set('buses', buses)
  return NextResponse.json({ success: true })
}
