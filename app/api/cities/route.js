import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

const defaultIndia = ['दिल्ली', 'मुंबई', 'बैंगलोर', 'सूरत', 'हैदराबाद', 'चेन्नई', 'कोलकाता', 'पुणे', 'अहमदाबाद', 'लखनऊ', 'चंडीगढ', 'जयपुर', 'गुडगाँव', 'नोएडा', 'लुधियाना', 'अमृतसर', 'पटना', 'रांची', 'गोरखपुर']
const defaultNepal = ['काठमाडौं', 'वीरगंज', 'भैरहवा', 'नेपालगंज', 'काकडभिट्टा', 'धनगढी', 'महेन्द्रनगर', 'पोखरा', 'जनकपुर', 'बुटवल', 'हेटौडा', 'बिराटनगर']

export async function GET() {
  let india = await kv.get('cities:india')
  let nepal = await kv.get('cities:nepal')
  
  if (!india) { india = defaultIndia; await kv.set('cities:india', india) }
  if (!nepal) { nepal = defaultNepal; await kv.set('cities:nepal', nepal) }
  
  return NextResponse.json({ india, nepal })
}

export async function POST(request) {
  const body = await request.json()
  const key = body.country === 'india' ? 'cities:india' : 'cities:nepal'
  const cities = await kv.get(key) || []
  
  if (!cities.includes(body.name)) {
    cities.push(body.name)
    await kv.set(key, cities)
  }
  
  return NextResponse.json({ success: true })
}
