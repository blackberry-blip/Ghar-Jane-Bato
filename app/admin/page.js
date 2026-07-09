'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [bookings, setBookings] = useState([])
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (authenticated) {
      const data = JSON.parse(localStorage.getItem('bookings') || '[]')
      setBookings(data.reverse())
    }
  }, [authenticated])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'admin123') {
      setAuthenticated(true)
    } else {
      alert('गलत पासवर्ड!')
    }
  }

  const updateStatus = (bookingId, newStatus) => {
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    const updated = allBookings.map(b => 
      b.id === bookingId ? { ...b, status: newStatus } : b
    )
    localStorage.setItem('bookings', JSON.stringify(updated))
    setBookings(updated.reverse())
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ff9800'
      case 'confirmed': return '#4caf50'
      case 'cancelled': return '#f44336'
      case 'completed': return '#2196f3'
      default: return '#999'
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'पर्खाइमा'
      case 'confirmed': return 'पक्का भयो'
      case 'cancelled': return 'रद्द भयो'
      case 'completed': return 'पूरा भयो'
      default: return status
    }
  }

  if (!authenticated) {
    return (
      <div style={{ 
        maxWidth: '400px', 
        margin: '80px auto', 
        padding: '20px' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px' }}>🔒</div>
          <h2 style={{ color: '#0D1B3E', margin: '8px 0' }}>
            व्यवस्थापक प्यानल
          </h2>
          <p style={{ color: '#888', fontSize: '14px' }}>
            घर जाने बाटो - Admin
          </p>
        </div>
        
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="पासवर्ड हाल्नुहोस्"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              fontSize: '16px',
              marginBottom: '16px',
              boxSizing: 'border-box'
            }}
          />
          <button type="submit" style={{
            width: '100%',
            padding: '14px',
            background: '#0D1B3E',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            लगइन गर्नुहोस्
          </button>
        </form>
        
        <button 
          onClick={() => router.push('/')}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '10px',
            background: 'none',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← फिर्ता जानुहोस्
        </button>
      </div>
    )
  }

  const pendingCount = bookings.filter(b => b.status === 'pending').length

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ color: '#0D1B3E', margin: '0 0 4px 0' }}>
            📋 सबै बुकिङहरू
          </h2>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
            {pendingCount > 0 ? (
              <span style={{ color: '#C0182A', fontWeight: 'bold' }}>
                ⚠️ {pendingCount} वटा पर्खाइमा छन्
              </span>
            ) : (
              'सबै बुकिङहरू हेरिएका छन्'
            )}
          </p>
        </div>
        <button 
          onClick={() => {
            setBookings(JSON.parse(localStorage.getItem('bookings') || '[]').reverse())
          }}
          style={{
            padding: '8px 16px',
            background: '#0D1B3E',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 रिफ्रेस
        </button>
      </div>

      {bookings.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
          <p style={{ color: '#999', margin: 0 }}>अहिलेसम्म कुनै बुकिङ छैन</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} style={{
            border: '1px solid #e0e0e0',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '12px',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            {/* Top Row: Route + Status */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              marginBottom: '12px' 
            }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', color: '#0D1B3E', fontSize: '18px' }}>
                  {booking.routeFrom} → {booking.routeTo}
                </h3>
                <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>
                  ID: {booking.id}
                </p>
              </div>
              <span style={{
                background: getStatusColor(booking.status),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}>
                {getStatusText(booking.status)}
              </span>
            </div>

            {/* Details Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '8px', 
              marginBottom: '14px', 
              fontSize: '14px' 
            }}>
              <div><strong style={{ color: '#666' }}>नाम:</strong> {booking.name}</div>
              <div><strong style={{ color: '#666' }}>फोन:</strong> {booking.phone}</div>
              <div><strong style={{ color: '#666' }}>सीट:</strong> {booking.seats}</div>
              <div><strong style={{ color: '#666' }}>रकम:</strong> ₹{booking.totalAmount}</div>
              <div><strong style={{ color: '#666' }}>मिति:</strong> {booking.date}</div>
              <div><strong style={{ color: '#666' }}>समय:</strong> {new Date(booking.createdAt).toLocaleString('ne-NP')}</div>
            </div>

            <div style={{ 
              background: '#f5f5f5', 
              borderRadius: '8px', 
              padding: '10px 12px',
              marginBottom: '14px',
              fontSize: '13px'
            }}>
              <p style={{ margin: '0 0 4px 0' }}><strong>पिकअप:</strong> {booking.pickup}</p>
              <p style={{ margin: 0 }}><strong>ड्रप:</strong> {booking.drop}</p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {booking.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus(booking.id, 'confirmed')} style={{
                    flex: 1,
                    padding: '10px',
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    ✅ पक्का गर्नुहोस्
                  </button>
                  <button onClick={() => updateStatus(booking.id, 'cancelled')} style={{
                    flex: 1,
                    padding: '10px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    ❌ रद्द गर्नुहोस्
                  </button>
                </>
              )}
              {booking.status === 'confirmed' && (
                <button onClick={() => updateStatus(booking.id, 'completed')} style={{
                  width: '100%',
                  padding: '10px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  ✓ यात्रा पूरा भयो
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {/* Logout */}
      <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '40px' }}>
        <button onClick={() => setAuthenticated(false)} style={{
          padding: '10px 20px',
          background: 'none',
          border: '1px solid #ddd',
          borderRadius: '8px',
          color: '#888',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          लगआउट
        </button>
      </div>
    </div>
  )
}
