'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const routes = [
  { id: 'delhi-kathmandu', from: 'दिल्ली', fromEn: 'Delhi', to: 'काठमाडौं', toEn: 'Kathmandu', price: 4500, time: '२४ घण्टा' },
  { id: 'delhi-nepalgunj', from: 'दिल्ली', fromEn: 'Delhi', to: 'नेपालगंज', toEn: 'Nepalgunj', price: 3200, time: '१८ घण्टा' },
  { id: 'mumbai-kathmandu', from: 'मुंबई', fromEn: 'Mumbai', to: 'काठमाडौं', toEn: 'Kathmandu', price: 5500, time: '३६ घण्टा' },
  { id: 'bangalore-kathmandu', from: 'बैंगलोर', fromEn: 'Bangalore', to: 'काठमाडौं', toEn: 'Kathmandu', price: 6000, time: '४० घण्टा' },
  { id: 'surat-kathmandu', from: 'सूरत', fromEn: 'Surat', to: 'काठमाडौं', toEn: 'Kathmandu', price: 5200, time: '३८ घण्टा' },
  { id: 'delhi-birgunj', from: 'दिल्ली', fromEn: 'Delhi', to: 'वीरगंज', toEn: 'Birgunj', price: 2800, time: '१६ घण्टा' },
  { id: 'lucknow-nepalgunj', from: 'लखनऊ', fromEn: 'Lucknow', to: 'नेपालगंज', toEn: 'Nepalgunj', price: 1800, time: '८ घण्टा' },
  { id: 'gorakhpur-bhairahawa', from: 'गोरखपुर', fromEn: 'Gorakhpur', to: 'भैरहवा', toEn: 'Bhairahawa', price: 1200, time: '४ घण्टा' },
]

export default function Home() {
  const [selectedRoute, setSelectedRoute] = useState(null)
  const router = useRouter()

  const handleBook = (route) => {
    setSelectedRoute(route)
    router.push(`/book?route=${route.id}`)
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🚌</div>
        <h1 style={{ 
          margin: 0, 
          color: '#0D1B3E', 
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          घर जाने बाटो
        </h1>
        <p style={{ 
          margin: '8px 0 0 0', 
          color: '#666', 
          fontSize: '14px' 
        }}>
          नेपाली श्रमिकको लागि सहज बस बुकिङ
        </p>
      </div>

      {/* Route Cards */}
      {routes.map((route) => (
        <div key={route.id} style={{
          border: '1px solid #e0e0e0',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '12px',
          background: '#fff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                margin: '0 0 4px 0', 
                color: '#0D1B3E',
                fontSize: '18px'
              }}>
                {route.from} → {route.to}
              </h3>
              <p style={{ margin: '0 0 4px 0', color: '#888', fontSize: '12px' }}>
                {route.fromEn} → {route.toEn}
              </p>
              <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>
                ⏱️ {route.time}
              </p>
            </div>
            <div style={{ textAlign: 'right', marginLeft: '12px' }}>
              <p style={{ 
                margin: '0 0 10px 0', 
                fontSize: '22px', 
                fontWeight: 'bold', 
                color: '#C0182A' 
              }}>
                ₹{route.price}
              </p>
              <button 
                onClick={() => handleBook(route)}
                style={{
                  background: '#C0182A',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}
              >
                बुक गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Trust Badge */}
      <div style={{
        textAlign: 'center',
        padding: '20px',
        marginTop: '20px',
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #e0e0e0'
      }}>
        <p style={{ margin: '0 0 8px 0', color: '#0D1B3E', fontWeight: 'bold' }}>
          ✅ विश्वसनीय सेवा
        </p>
        <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>
          १०,०००+ नेपाली श्रमिकले विश्वास गरेका छन्
        </p>
      </div>

      {/* Admin Link */}
      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
        <a href="/admin" style={{
          color: '#888',
          fontSize: '12px',
          textDecoration: 'none'
        }}>
          व्यवस्थापक प्यानल →
        </a>
      </div>
    </div>
  )
}
