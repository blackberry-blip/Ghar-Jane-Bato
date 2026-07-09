'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const routes = {
  'delhi-kathmandu': { from: 'दिल्ली', to: 'काठमाडौं', price: 4500 },
  'delhi-nepalgunj': { from: 'दिल्ली', to: 'नेपालगंज', price: 3200 },
  'mumbai-kathmandu': { from: 'मुंबई', to: 'काठमाडौं', price: 5500 },
  'bangalore-kathmandu': { from: 'बैंगलोर', to: 'काठमाडौं', price: 6000 },
  'surat-kathmandu': { from: 'सूरत', to: 'काठमाडौं', price: 5200 },
  'delhi-birgunj': { from: 'दिल्ली', to: 'वीरगंज', price: 2800 },
  'lucknow-nepalgunj': { from: 'लखनऊ', to: 'नेपालगंज', price: 1800 },
  'gorakhpur-bhairahawa': { from: 'गोरखपुर', to: 'भैरहवा', price: 1200 },
}

function BookForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const routeId = searchParams.get('route')
  const route = routes[routeId]

  const [form, setForm] = useState({
    name: '',
    phone: '',
    seats: '1',
    date: '',
    pickup: '',
    drop: '',
  })
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(false)

  if (!route) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>मार्ग भेटिएन</p>
        <button onClick={() => router.push('/')} style={{
          marginTop: '16px',
          padding: '10px 20px',
          background: '#0D1B3E',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          ← फिर्ता जानुहोस्
        </button>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const booking = {
      id: 'GJB' + Date.now(),
      routeId,
      routeFrom: route.from,
      routeTo: route.to,
      price: route.price,
      ...form,
      seats: parseInt(form.seats),
      totalAmount: route.price * parseInt(form.seats),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem('bookings') || '[]')
    existing.push(booking)
    localStorage.setItem('bookings', JSON.stringify(existing))

    setLoading(false)
    setBooked(true)
  }

  if (booked) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h2 style={{ color: '#0D1B3E', marginBottom: '8px' }}>
          बुकिङ सफल भयो!
        </h2>
        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
          हामी ३० मिनेटभित्र तपाईंलाई फोन गरेर सीट
          <br />पक्का गर्ने जानकारी दिनेछौं।
        </p>
        
        <div style={{
          background: '#f5f5f5',
          borderRadius: '12px',
          padding: '20px',
          margin: '20px 0',
          textAlign: 'left'
        }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>मार्ग:</strong> {route.from} → {route.to}</p>
          <p style={{ margin: '0 0 8px 0' }}><strong>रकम:</strong> ₹{route.price * parseInt(form.seats)}</p>
          <p style={{ margin: '0 0 8px 0' }}><strong>फोन:</strong> {form.phone}</p>
          <p style={{ margin: '0 0 8px 0' }}><strong>मिति:</strong> {form.date}</p>
          <p style={{ margin: 0 }}><strong>सीट:</strong> {form.seats}</p>
        </div>

        <p style={{ 
          color: '#C0182A', 
          fontWeight: 'bold',
          fontSize: '16px',
          marginBottom: '20px'
        }}>
          📞 कृपया फोनको पर्खाइ गर्नुहोस्!
        </p>

        <button onClick={() => router.push('/')} style={{
          padding: '12px 24px',
          background: '#0D1B3E',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          ← अर्को बुकिङ
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px' }}>
      <button 
        onClick={() => router.push('/')}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: '#666', 
          cursor: 'pointer', 
          marginBottom: '16px',
          fontSize: '16px'
        }}
      >
        ← फिर्ता
      </button>
      
      <h2 style={{ color: '#0D1B3E', marginBottom: '4px', fontSize: '22px' }}>
        {route.from} → {route.to}
      </h2>
      <p style={{ color: '#C0182A', fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
        ₹{route.price} प्रति सीट
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>
            पूरा नाम *
          </label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            placeholder="जस्तै: राम बहादुर"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>
            फोन नम्बर (WhatsApp) *
          </label>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
            placeholder="+91 98765 43210"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>
            सीट संख्या *
          </label>
          <select
            value={form.seats}
            onChange={(e) => setForm({...form, seats: e.target.value})}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              fontSize: '16px',
              boxSizing: 'border-box',
              background: '#fff'
            }}
          >
            {[1,2,3,4,5].map(n => (
              <option key={n} value={n}>{n} सीट{n > 1 ? 'हरू' : ''}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>
            यात्रा मिति *
          </label>
          <input
            required
            type="date"
            value={form.date}
            onChange={(e) => setForm({...form, date: e.target.value})}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>
            पिकअप स्थान (भारत) *
          </label>
          <input
            required
            type="text"
            value={form.pickup}
            onChange={(e) => setForm({...form, pickup: e.target.value})}
            placeholder="जस्तै: ISBT Kashmere Gate, दिल्ली"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>
            ड्रप स्थान (नेपाल) *
          </label>
          <input
            required
            type="text"
            value={form.drop}
            onChange={(e) => setForm({...form, drop: e.target.value})}
            placeholder="जस्तै: कलंकी, काठमाडौं"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{
          background: '#fff8e1',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          border: '1px solid #ffe082'
        }}>
          <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', color: '#0D1B3E', fontSize: '16px' }}>
            📝 बुकिङ सारांश
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
            <span style={{ color: '#666' }}>{form.seats} × {route.from} → {route.to}</span>
            <span style={{ fontWeight: '500' }}>₹{route.price * parseInt(form.seats)}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontWeight: 'bold', 
            borderTop: '1px solid #ffe082', 
            paddingTop: '10px', 
            marginTop: '10px',
            fontSize: '16px'
          }}>
            <span>कुल रकम</span>
            <span style={{ color: '#C0182A' }}>₹{route.price * parseInt(form.seats)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '18px',
            background: '#C0182A',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'बुकिङ हुँदैछ...' : 'बुकिङ पक्का गर्नुहोस्'}
        </button>

        <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', marginTop: '16px' }}>
          💡 सीट पक्का भएपछि मात्र भुक्तानी गर्नुहोस्
        </p>
      </form>
    </div>
  )
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div style={{ 
      maxWidth: '480px', 
      margin: '0 auto', 
      padding: '60px 20px', 
      textAlign: 'center' 
    }}>
      <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
      <p style={{ color: '#666' }}>लोड हुँदैछ...</p>
    </div>
  )
}

// Main export with Suspense wrapper
export default function BookPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BookForm />
    </Suspense>
  )
}
