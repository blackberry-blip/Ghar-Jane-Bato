import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  const bookings = await kv.get('bookings') || []
  
  // If ID provided, return single booking
  if (id) {
    const booking = bookings.find(b => b.id === id)
    return NextResponse.json(booking || { error: 'Not found' })
  }
  
  // Otherwise return all
  return NextResponse.json(bookings)
}

export async function POST(request) {
  const body = await request.json()
  const bookings = await kv.get('bookings') || []
  
  const newBooking = {
    id: body.id || 'GJB' + Date.now(),
    busId: body.busId,
    busOperator: body.busOperator,
    busType: body.busType,
    from: body.from,
    to: body.to,
    price: body.price,
    name: body.name,
    phone: body.phone,
    seats: body.seats,
    totalAmount: body.totalAmount,
    date: body.date,
    status: body.status || 'pending',
    createdAt: body.createdAt || new Date().toISOString(),
  }
  
  bookings.unshift(newBooking)
  await kv.set('bookings', bookings)
  return NextResponse.json({ success: true, booking: newBooking })
}

export async function PUT(request) {
  const body = await request.json()
  let bookings = await kv.get('bookings') || []
  
  bookings = bookings.map(b => 
    b.id === body.id ? { ...b, status: body.status } : b
  )
  
  await kv.set('bookings', bookings)
  return NextResponse.json({ success: true })
}
