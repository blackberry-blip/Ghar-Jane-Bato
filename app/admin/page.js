'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [bookings, setBookings] = useState([])
  const [buses, setBuses] = useState([])
  const [indiaCities, setIndiaCities] = useState([])
  const [nepalCities, setNepalCities] = useState([])
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('bookings')
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()
  
  // New bus form
  const [newBus, setNewBus] = useState({ operator: '', from: '', to: '', type: 'डिलक्स', price: '', time: '', seats: '' })
  // New city form
  const [newCity, setNewCity] = useState({ name: '', country: 'india' })
  
  useEffect(() => {
    if (!authenticated) return
    const data = JSON.parse(localStorage.getItem('bookings') || '[]')
    setBookings(data.reverse())
    
    fetch('/api/buses').then(r => r.json()).then(setBuses)
    fetch('/api/cities').then(r => r.json()).then(d => {
      setIndiaCities(d.india || [])
      setNepalCities(d.nepal || [])
    })
  }, [authenticated, refreshKey])
  
  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'admin123') setAuthenticated(true)
    else alert('गलत पासवर्ड!')
  }
  
  const updateStatus = (bookingId, newStatus) => {
    const all = JSON.parse(localStorage.getItem('bookings') || '[]')
    const updated = all.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
    localStorage.setItem('bookings', JSON.stringify(updated))
    setBookings(updated.reverse())
  }
  
  const addBus = async (e) => {
    e.preventDefault()
    if (!newBus.operator || !newBus.from || !newBus.to || !newBus.price || !newBus.time || !newBus.seats) {
      alert('सबै विवरण भर्नुहोस्');
      return
    }
    const res = await fetch('/api/buses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newBus) })
    if (res.ok) {
      alert('बस थपियो!')
      setNewBus({ operator: '', from: '', to: '', type: 'डिलक्स', price: '', time: '', seats: '' })
      setRefreshKey(k => k + 1)
    }
  }
  
  const deleteBus = async (id) => {
    if (!confirm('यो बस हटाउने?')) return
    await fetch(`/api/buses?id=${id}`, { method: 'DELETE' })
    setRefreshKey(k => k + 1)
  }
  
  const addCity = async (e) => {
    e.preventDefault()
    if (!newCity.name) return
    const res = await fetch('/api/cities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCity) })
    if (res.ok) {
      alert('शहर थपियो!')
      setNewCity({ name: '', country: 'india' })
      setRefreshKey(k => k + 1)
    }
  }
  
  const getStatusColor = (s) => ({ pending: '#ff9800', confirmed: '#4caf50', cancelled: '#f44336', completed: '#2196f3' } [s] || '#999')
  const getStatusText = (s) => ({ pending: 'पर्खाइमा', confirmed: 'पक्का भयो', cancelled: 'रद्द भयो', completed: 'पूरा भयो' } [s] || s)
  
  if (!authenticated) {
    return (
      <div style={{ maxWidth: '400px', margin: '80px auto', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px' }}>🔒</div>
          <h2 style={{ color: '#0D1B3E', margin: '8px 0' }}>व्यवस्थापक प्यानल</h2>
          <p style={{ color: '#888', fontSize: '14px' }}>घर जाने बाटो - Admin</p>
        </div>
        <form onSubmit={handleLogin}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="पासवर्ड हाल्नुहोस्" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '14px', background: '#0D1B3E', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>लगइन गर्नुहोस्</button>
        </form>
        <button onClick={() => router.push('/')} style={{ width: '100%', marginTop: '12px', padding: '10px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }}>← फिर्ता जानुहोस्</button>
      </div>
    )
  }
  
  const pendingCount = bookings.filter(b => b.status === 'pending').length
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      <h2 style={{ color: '#0D1B3E', margin: '0 0 16px 0' }}>📋 व्यवस्थापक प्यानल</h2>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflow: 'auto' }}>
        {[{ id: 'bookings', label: `बुकिङ (${pendingCount})` }, { id: 'buses', label: 'बसहरू' }, { id: 'cities', label: 'शहरहरू' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', background: activeTab === tab.id ? '#0D1B3E' : '#f0f0f0', color: activeTab === tab.id ? '#fff' : '#666', whiteSpace: 'nowrap' }}>{tab.label}</button>
        ))}
      </div>

      {/* BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <>
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
              <p style={{ color: '#999', margin: 0 }}>अहिलेसम्म कुनै बुकिङ छैन</p>
            </div>
          ) : bookings.map((booking) => (
            <div key={booking.id} style={{ border: '1px solid #e0e0e0', borderRadius: '16px', padding: '16px', marginBottom: '12px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', color: '#0D1B3E', fontSize: '17px' }}>{booking.from} → {booking.to}</h3>
                  <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '14px' }}><strong>{booking.busOperator}</strong> • {booking.busType}</p>
                  <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>ID: {booking.id}</p>
                </div>
                <span style={{ background: getStatusColor(booking.status), color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{getStatusText(booking.status)}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', fontSize: '14px' }}>
                <div><strong style={{ color: '#666' }}>नाम:</strong> {booking.name}</div>
                <div><strong style={{ color: '#666' }}>फोन:</strong> {booking.phone}</div>
                <div><strong style={{ color: '#666' }}>सीट:</strong> {booking.seats}</div>
                <div><strong style={{ color: '#666' }}>रकम:</strong> ₹{booking.totalAmount}</div>
                <div><strong style={{ color: '#666' }}>मिति:</strong> {booking.date}</div>
                <div><strong style={{ color: '#666' }}>समय:</strong> {new Date(booking.createdAt).toLocaleString('ne-NP')}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {booking.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(booking.id, 'confirmed')} style={{ flex: 1, padding: '10px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>✅ पक्का गर्नुहोस्</button>
                    <button onClick={() => updateStatus(booking.id, 'cancelled')} style={{ flex: 1, padding: '10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>❌ रद्द गर्नुहोस्</button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <button onClick={() => updateStatus(booking.id, 'completed')} style={{ width: '100%', padding: '10px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>✓ यात्रा पूरा भयो</button>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {/* BUSES TAB */}
      {activeTab === 'buses' && (
        <div>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ color: '#0D1B3E', margin: '0 0 16px 0' }}>➕ नयाँ बस थप्नुहोस्</h3>
            <form onSubmit={addBus}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input placeholder="अपरेटर नाम" value={newBus.operator} onChange={e => setNewBus({...newBus, operator: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }} />
                <select value={newBus.from} onChange={e => setNewBus({...newBus, from: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', background: '#fff' }}>
                  <option value="">कहाँबाट (भारत)</option>
                  {indiaCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={newBus.to} onChange={e => setNewBus({...newBus, to: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', background: '#fff' }}>
                  <option value="">कहाँसम्म (नेपाल)</option>
                  {nepalCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={newBus.type} onChange={e => setNewBus({...newBus, type: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', background: '#fff' }}>
                  <option>डिलक्स</option>
                  <option>AC स्लीपर</option>
                  <option>सोफा बस</option>
                  <option>साधारण</option>
                </select>
                <input placeholder="मूल्य (₹)" type="number" value={newBus.price} onChange={e => setNewBus({...newBus, price: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }} />
                <input placeholder="समय (जस्तै: १६ घण्टा)" value={newBus.time} onChange={e => setNewBus({...newBus, time: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }} />
                <input placeholder="कुल सीट" type="number" value={newBus.seats} onChange={e => setNewBus({...newBus, seats: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }} />
              </div>
              <button type="submit" style={{ width: '100%', marginTop: '12px', padding: '14px', background: '#C0182A', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>बस थप्नुहोस्</button>
            </form>
          </div>

          <h3 style={{ color: '#0D1B3E', margin: '0 0 12px 0' }}>🚌 सबै बसहरू</h3>
          {buses.map(bus => (
            <div key={bus.id} style={{ background: '#fff', borderRadius: '12px', padding: '14px', marginBottom: '10px', border: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#0D1B3E' }}>{bus.operator}</p>
                <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>{bus.from} → {bus.to} • {bus.type} • ₹{bus.price}</p>
              </div>
              <button onClick={() => deleteBus(bus.id)} style={{ padding: '8px 14px', background: '#ffebee', color: '#C0182A', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>हटाउनुहोस्</button>
            </div>
          ))}
        </div>
      )}

      {/* CITIES TAB */}
      {activeTab === 'cities' && (
        <div>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ color: '#0D1B3E', margin: '0 0 16px 0' }}>➕ नयाँ शहर थप्नुहोस्</h3>
            <form onSubmit={addCity}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select value={newCity.country} onChange={e => setNewCity({...newCity, country: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', background: '#fff' }}>
                  <option value="india">🇮🇳 भारत</option>
                  <option value="nepal">🇳🇵 नेपाल</option>
                </select>
                <input placeholder="शहरको नाम" value={newCity.name} onChange={e => setNewCity({...newCity, name: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }} />
                <button type="submit" style={{ padding: '12px 20px', background: '#0D1B3E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>थप्नुहोस्</button>
              </div>
            </form>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <h4 style={{ color: '#0D1B3E', margin: '0 0 10px 0' }}>🇮🇳 भारत</h4>
              {indiaCities.map(c => <div key={c} style={{ background: '#fff', padding: '10px 14px', borderRadius: '8px', marginBottom: '6px', border: '1px solid #e0e0e0', fontSize: '14px' }}>{c}</div>)}
            </div>
            <div>
              <h4 style={{ color: '#0D1B3E', margin: '0 0 10px 0' }}>🇳🇵 नेपाल</h4>
              {nepalCities.map(c => <div key={c} style={{ background: '#fff', padding: '10px 14px', borderRadius: '8px', marginBottom: '6px', border: '1px solid #e0e0e0', fontSize: '14px' }}>{c}</div>)}
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '40px' }}>
        <button onClick={() => setAuthenticated(false)} style={{ padding: '10px 20px', background: 'none', border: '1px solid #ddd', borderRadius: '8px', color: '#888', cursor: 'pointer', fontSize: '14px' }}>लगआउट</button>
      </div>
    </div>
  )
}