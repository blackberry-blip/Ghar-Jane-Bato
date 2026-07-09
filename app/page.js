'use client'

import { useState, useEffect, useRef } from 'react'

// ===== DATA =====
const indiaCities = [
  'दिल्ली', 'मुंबई', 'बैंगलोर', 'सूरत', 'हैदराबाद', 'चेन्नई', 
  'कोलकाता', 'पुणे', 'अहमदाबाद', 'लखनऊ', 'चंडीगढ', 'जयपुर',
  'गुडगाँव', 'नोएडा', 'लुधियाना', 'अमृतसर', 'पटना', 'रांची'
]

const nepalCities = [
  'काठमाडौं', 'वीरगंज', 'भैरहवा', 'नेपालगंज', 'काकडभिट्टा', 
  'धनगढी', 'महेन्द्रनगर', 'पोखरा', 'जनकपुर', 'बुटवल', 
  'हेटौडा', 'बिराटनगर'
]

const allBuses = [
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
  { id: 'B11', operator: 'गाउँ फर्कने बाटो', from: 'चंडीगढ', to: 'काठमाडौं', type: 'AC', price: 3500, time: '२० घण्टा', seats: 42, available: 18 },
  { id: 'B12', operator: 'मायाको बस', from: 'पटना', to: 'वीरगंज', type: 'डिलक्स', price: 1500, time: '६ घण्टा', seats: 48, available: 25 },
]

// ===== COMPONENTS =====

function SearchableDropdown({ label, placeholder, options, value, onChange, icon }) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = options.filter(c => c.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div ref={ref} style={{ position: 'relative', marginBottom: '16px' }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#0D1B3E', fontSize: '14px' }}>
        {label}
      </label>
      <div 
        onClick={() => setOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '14px',
          borderRadius: '12px',
          border: '2px solid #e0dcd3',
          background: '#fff',
          cursor: 'pointer',
          fontSize: '16px',
          color: value ? '#0D1B3E' : '#999'
        }}
      >
        <span style={{ marginRight: '10px', fontSize: '20px' }}>{icon}</span>
        <span>{value || placeholder}</span>
      </div>
      
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '6px',
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e0dcd3',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 100,
          maxHeight: '280px',
          overflow: 'auto'
        }}>
          <input
            autoFocus
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="खोज्नुहोस्..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              borderBottom: '1px solid #eee',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {filtered.map((city) => (
            <div
              key={city}
              onClick={() => { onChange(city); setOpen(false); setFilter('') }}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid #f5f5f5',
                fontSize: '15px',
                color: '#0D1B3E'
              }}
              onMouseEnter={(e) => e.target.style.background = '#fff8e1'}
              onMouseLeave={(e) => e.target.style.background = '#fff'}
            >
              {city}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '16px', color: '#999', textAlign: 'center' }}>केही भेटिएन</div>
          )}
        </div>
      )}
    </div>
  )
}

function WelcomeScreen({ onStart }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(135deg, #0D1B3E 0%, #1a2d5c 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      textAlign: 'center',
      zIndex: 1000
    }}>
      <div style={{ fontSize: '72px', marginBottom: '20px' }}>🏔️</div>
      <h1 style={{
        color: '#C9A84C',
        fontSize: '32px',
        margin: '0 0 12px 0',
        fontWeight: 'bold'
      }}>
        घर जाने बाटो
      </h1>
      <p style={{
        color: '#fff',
        fontSize: '18px',
        lineHeight: '1.7',
        maxWidth: '320px',
        margin: '0 0 32px 0'
      }}>
        "तपाईंको मेहनतले भारतलाई बनाउनुभयो,<br/>
        अब हामी तपाईंलाई घर पुर्‍याउँछौं"
      </p>
      <p style={{
        color: 'rgba(255,255,255,0.7)',
        fontSize: '14px',
        lineHeight: '1.6',
        maxWidth: '300px',
        margin: '0 0 40px 0'
      }}>
        दशैं होस् या तिहार, छठ होस् या जुनसुकै दिन —<br/>
        आमाको माया, बुबाको आशीर्वाद, परिवारको बाटो<br/>
        हामी सजिलो बनाउँछौं
      </p>
      <button
        onClick={onStart}
        style={{
          padding: '16px 48px',
          background: '#C0182A',
          color: '#fff',
          border: 'none',
          borderRadius: '50px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(192,24,42,0.4)'
        }}
      >
        घर जाने बाटो खोज्नुहोस् →
      </button>
    </div>
  )
}

function BusCard({ bus, onSelect }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '12px',
      border: '1px solid #e8e4db',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', color: '#0D1B3E', fontSize: '17px' }}>{bus.operator}</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>{bus.type} • {bus.time}</p>
        </div>
        <span style={{
          background: bus.available < 10 ? '#ffebee' : '#e8f5e9',
          color: bus.available < 10 ? '#C0182A' : '#2e7d32',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {bus.available} सीट बाँकी
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: '0 0 2px 0', fontSize: '20px', fontWeight: 'bold', color: '#C0182A' }}>₹{bus.price}</p>
          <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>प्रति सीट</p>
        </div>
        <button
          onClick={() => onSelect(bus)}
          style={{
            padding: '10px 24px',
            background: '#0D1B3E',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          छान्नुहोस्
        </button>
      </div>
    </div>
  )
}

function BookingModal({ bus, from, to, onClose, onConfirm }) {
  const [form, setForm] = useState({ name: '', phone: '', seats: '1', date: '' })
  const [showPay, setShowPay] = useState(false)

  const total = bus.price * parseInt(form.seats || 1)

  const handleProceed = () => {
    if (!form.name || !form.phone || !form.date) {
      alert('कृपया सबै विवरण भर्नुहोस्')
      return
    }
    setShowPay(true)
  }

  const handlePay = () => {
    const booking = {
      id: 'GJB' + Date.now(),
      busId: bus.id,
      busOperator: bus.operator,
      busType: bus.type,
      from,
      to,
      price: bus.price,
      ...form,
      seats: parseInt(form.seats),
      totalAmount: total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    const existing = JSON.parse(localStorage.getItem('bookings') || '[]')
    existing.push(booking)
    localStorage.setItem('bookings', JSON.stringify(existing))
    onConfirm(booking)
  }

  if (showPay) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
        zIndex: 200
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '28px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🙏</div>
          <h2 style={{ color: '#0D1B3E', margin: '0 0 8px 0' }}>बुकिङ पक्का गर्नुहोस्</h2>
          <p style={{ color: '#666', margin: '0 0 20px 0', fontSize: '14px' }}>
            {form.name} जी, तपाईंको बुकिङ सुरक्षित छ
          </p>
          
          <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>मार्ग</span>
              <span style={{ fontWeight: '600' }}>{from} → {to}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>सीट</span>
              <span style={{ fontWeight: '600' }}>{form.seats}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: '10px' }}>
              <span style={{ fontWeight: 'bold', color: '#0D1B3E' }}>कुल रकम</span>
              <span style={{ fontWeight: 'bold', color: '#C0182A', fontSize: '20px' }}>₹{total}</span>
            </div>
          </div>

          <button
            onClick={handlePay}
            style={{
              width: '100%',
              padding: '16px',
              background: '#C0182A',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            ₹{total} भुक्तानी गर्नुहोस्
          </button>
          <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
            💡 भुक्तानी पछि हामी ३० मिनेटमा फोन गर्नेछौं
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      zIndex: 200
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '24px 24px 0 0',
        padding: '24px',
        width: '100%',
        maxWidth: '480px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#0D1B3E', fontSize: '20px' }}>बुकिङ विवरण</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ background: '#fff8e1', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
          <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#0D1B3E' }}>{bus.operator}</p>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{from} → {to} • {bus.type}</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>पूरा नाम *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            placeholder="जस्तै: राम बहादुर"
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>फोन नम्बर *</label>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
            placeholder="+91 98765 43210"
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>सीट *</label>
            <select
              value={form.seats}
              onChange={(e) => setForm({...form, seats: e.target.value})}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box', background: '#fff' }}
            >
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>यात्रा मिति *</label>
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => setForm({...form, date: e.target.value})}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
            <span>कुल रकम</span>
            <span style={{ color: '#C0182A' }}>₹{total}</span>
          </div>
        </div>

        <button
          onClick={handleProceed}
          style={{
            width: '100%',
            padding: '16px',
            background: '#0D1B3E',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          अगाडि बढ्नुहोस् →
        </button>
      </div>
    </div>
  )
}

function ConfirmationScreen({ booking, onReset }) {
  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
      <h2 style={{ color: '#0D1B3E', margin: '0 0 8px 0' }}>बुकिङ सफल भयो!</h2>
      <p style={{ color: '#666', lineHeight: '1.7', marginBottom: '24px' }}>
        {booking.name} जी, तपाईंको बुकिङ सुरक्षित छ।<br/>
        हामी <strong>३० मिनेटभित्र</strong> फोन गरेर सीट पक्का गर्ने जानकारी दिनेछौं।
      </p>
      
      <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '24px', textAlign: 'left', border: '1px solid #e0dcd3' }}>
        <p style={{ margin: '0 0 8px 0' }}><strong>बुकिङ ID:</strong> <span style={{ color: '#C0182A' }}>{booking.id}</span></p>
        <p style={{ margin: '0 0 8px 0' }}><strong>मार्ग:</strong> {booking.from} → {booking.to}</p>
        <p style={{ margin: '0 0 8px 0' }}><strong>अपरेटर:</strong> {booking.busOperator}</p>
        <p style={{ margin: '0 0 8px 0' }}><strong>सीट:</strong> {booking.seats}</p>
        <p style={{ margin: '0 0 8px 0' }}><strong>रकम:</strong> ₹{booking.totalAmount}</p>
        <p style={{ margin: 0 }}><strong>मिति:</strong> {booking.date}</p>
      </div>

      <p style={{ color: '#C0182A', fontWeight: 'bold', fontSize: '16px', marginBottom: '24px' }}>
        📞 कृपया फोनको पर्खाइ गर्नुहोस्!
      </p>

      <button onClick={onReset} style={{
        padding: '14px 32px',
        background: '#0D1B3E',
        color: '#fff',
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

// ===== MAIN PAGE =====

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [step, setStep] = useState('search') // search, results, confirmation
  const [fromCity, setFromCity] = useState('')
  const [toCity, setToCity] = useState('')
  const [filteredBuses, setFilteredBuses] = useState([])
  const [selectedBus, setSelectedBus] = useState(null)
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  const handleSearch = () => {
    if (!fromCity || !toCity) {
      alert('कृपया दुवै शहर छान्नुहोस्')
      return
    }
    const results = allBuses.filter(b => b.from === fromCity && b.to === toCity)
    setFilteredBuses(results)
    setStep('results')
  }

  const handleSelectBus = (bus) => {
    setSelectedBus(bus)
  }

  const handleConfirm = (booking) => {
    setConfirmedBooking(booking)
    setSelectedBus(null)
    setStep('confirmation')
  }

  const handleReset = () => {
    setStep('search')
    setFromCity('')
    setToCity('')
    setFilteredBuses([])
    setConfirmedBooking(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f6f1' }}>
      {showWelcome && <WelcomeScreen onStart={() => setShowWelcome(false)} />}

      {!showWelcome && step === 'search' && (
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚌</div>
            <h1 style={{ color: '#0D1B3E', margin: '0 0 8px 0', fontSize: '26px' }}>घर जाने बाटो</h1>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              "आमाको माया, बुबाको आशीर्वाद —<br/>घर फर्कने बाटो, हामी सजिलो बनाउँछौं"
            </p>
          </div>

          {/* Search Card */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e8e4db'
          }}>
            <h2 style={{ color: '#0D1B3E', margin: '0 0 20px 0', fontSize: '18px', textAlign: 'center' }}>
              कहाँबाट कहाँ जाने?
            </h2>

            <SearchableDropdown
              label="कहाँबाट (भारत)"
              placeholder="शहर छान्नुहोस्"
              options={indiaCities}
              value={fromCity}
              onChange={setFromCity}
              icon="🇮🇳"
            />

            <div style={{ textAlign: 'center', margin: '-8px 0 8px 0' }}>
              <span style={{ fontSize: '24px' }}>⇅</span>
            </div>

            <SearchableDropdown
              label="कहाँसम्म (नेपाल)"
              placeholder="शहर छान्नुहोस्"
              options={nepalCities}
              value={toCity}
              onChange={setToCity}
              icon="🇳🇵"
            />

            <button
              onClick={handleSearch}
              style={{
                width: '100%',
                padding: '16px',
                background: '#C0182A',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              बस खोज्नुहोस् 🔍
            </button>
          </div>

          {/* Trust */}
          <div style={{ textAlign: 'center', marginTop: '32px', padding: '0 20px' }}>
            <p style={{ color: '#888', fontSize: '13px', lineHeight: '1.6' }}>
              ✅ विश्वसनीय सेवा • 🏔️ नेपाली मालिक • 📞 २४/७ सहयोग
            </p>
          </div>

          {/* Admin Link */}
          <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
            <a href="/admin" style={{ color: '#aaa', fontSize: '12px', textDecoration: 'none' }}>
              व्यवस्थापक प्यानल →
            </a>
          </div>
        </div>
      )}

      {!showWelcome && step === 'results' && (
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px' }}>
          <button onClick={() => setStep('search')} style={{ background: 'none', border: 'none', color: '#666', fontSize: '16px', cursor: 'pointer', marginBottom: '16px' }}>
            ← फिर्ता
          </button>
          
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: '#0D1B3E', margin: '0 0 4px 0', fontSize: '20px' }}>
              {fromCity} → {toCity}
            </h2>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              {filteredBuses.length} वटा बस भेटियो
            </p>
          </div>

          {filteredBuses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '16px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>😔</div>
              <p style={{ color: '#666' }}>यो मार्गमा अहिले कुनै बस उपलब्ध छैन।</p>
              <button onClick={() => setStep('search')} style={{ marginTop: '16px', padding: '10px 20px', background: '#0D1B3E', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                अर्को मार्ग खोज्नुहोस्
              </button>
            </div>
          ) : (
            filteredBuses.map(bus => (
              <BusCard key={bus.id} bus={bus} onSelect={handleSelectBus} />
            ))
          )}

          {selectedBus && (
            <BookingModal
              bus={selectedBus}
              from={fromCity}
              to={toCity}
              onClose={() => setSelectedBus(null)}
              onConfirm={handleConfirm}
            />
          )}
        </div>
      )}

      {!showWelcome && step === 'confirmation' && confirmedBooking && (
        <ConfirmationScreen booking={confirmedBooking} onReset={handleReset} />
      )}
    </div>
  )
}
