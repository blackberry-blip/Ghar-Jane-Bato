'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function TicketPage() {
  const [ticketId, setTicketId] = useState('')
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const searchTicket = async () => {
    if (!ticketId.trim()) return
    setLoading(true)
    setNotFound(false)
    setTicket(null)

    try {
      const res = await fetch(`/api/bookings?id=${ticketId.trim()}`)
      const data = await res.json()
      
      if (data && data.id) {
        setTicket(data)
      } else {
        setNotFound(true)
      }
    } catch (err) {
      setNotFound(true)
    }
    setLoading(false)
  }

  const downloadTicket = () => {
    const svg = document.getElementById('ticket-qr')
    if (!svg) return
    
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `ticket-${ticket.id}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f6f1' }}>
      {/* Header */}
      <div style={{ background: '#0D1B3E', padding: '20px 16px', textAlign: 'center' }}>
        <h1 style={{ color: '#C9A84C', margin: 0, fontSize: '24px' }}>🎫 मेरो टिकट</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '4px 0 0 0', fontSize: '13px' }}>आफ्नो डिजिटल टिकट हेर्नुहोस्</p>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Search Box */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#0D1B3E', fontSize: '14px' }}>
            बुकिङ ID हाल्नुहोस्
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="जस्तै: GJB123456789"
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '10px',
                border: '2px solid #e0dcd3',
                fontSize: '16px',
                outline: 'none'
              }}
              onKeyPress={(e) => e.key === 'Enter' && searchTicket()}
            />
            <button
              onClick={searchTicket}
              disabled={loading}
              style={{
                padding: '14px 24px',
                background: '#C0182A',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '⏳' : '🔍'}
            </button>
          </div>
        </div>

        {/* Not Found */}
        {notFound && (
          <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '16px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>😕</div>
            <p style={{ color: '#666', margin: 0 }}>यो बुकिङ ID भेटिएन</p>
            <p style={{ color: '#888', fontSize: '13px', marginTop: '8px' }}>कृपया सही ID हाल्नुहोस्</p>
          </div>
        )}

        {/* Ticket Display */}
        {ticket && (
          <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            {/* Ticket Header */}
            <div style={{ background: '#0D1B3E', padding: '20px', textAlign: 'center' }}>
              <h2 style={{ color: '#C9A84C', margin: '0 0 4px 0', fontSize: '20px' }}>घर जाने बाटो</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '12px' }}>डिजिटल यात्रा टिकट</p>
            </div>

            {/* Ticket Body */}
            <div style={{ padding: '24px' }}>
              {/* Status Badge */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{
                  background: ticket.status === 'confirmed' ? '#e8f5e9' : ticket.status === 'pending' ? '#fff8e1' : '#ffebee',
                  color: ticket.status === 'confirmed' ? '#2e7d32' : ticket.status === 'pending' ? '#f57c00' : '#C0182A',
                  padding: '6px 20px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {ticket.status === 'confirmed' ? '✅ पक्का भयो' : ticket.status === 'pending' ? '⏳ पर्खाइमा' : '❌ रद्द भयो'}
                </span>
              </div>

              {/* Route */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h3 style={{ color: '#0D1B3E', margin: '0 0 8px 0', fontSize: '22px' }}>
                  {ticket.from} → {ticket.to}
                </h3>
                <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>{ticket.busOperator} • {ticket.busType}</p>
              </div>

              {/* Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#f5f5f5', padding: '14px', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 4px 0', color: '#888', fontSize: '12px' }}>यात्रु</p>
                  <p style={{ margin: 0, color: '#0D1B3E', fontWeight: 'bold', fontSize: '15px' }}>{ticket.name}</p>
                </div>
                <div style={{ background: '#f5f5f5', padding: '14px', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 4px 0', color: '#888', fontSize: '12px' }}>फोन</p>
                  <p style={{ margin: 0, color: '#0D1B3E', fontWeight: 'bold', fontSize: '15px' }}>{ticket.phone}</p>
                </div>
                <div style={{ background: '#f5f5f5', padding: '14px', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 4px 0', color: '#888', fontSize: '12px' }}>सीट</p>
                  <p style={{ margin: 0, color: '#0D1B3E', fontWeight: 'bold', fontSize: '15px' }}>{ticket.seats} सीट</p>
                </div>
                <div style={{ background: '#f5f5f5', padding: '14px', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 4px 0', color: '#888', fontSize: '12px' }}>मिति</p>
                  <p style={{ margin: 0, color: '#0D1B3E', fontWeight: 'bold', fontSize: '15px' }}>{ticket.date}</p>
                </div>
              </div>

              {/* Amount */}
              <div style={{ background: '#fff8e1', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '13px' }}>कुल रकम</p>
                <p style={{ margin: 0, color: '#C0182A', fontSize: '28px', fontWeight: 'bold' }}>₹{ticket.totalAmount}</p>
              </div>

              {/* QR Code */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '13px' }}>यो QR कोड बसमा देखाउनुहोस्</p>
                <div style={{ display: 'inline-block', padding: '16px', background: '#fff', borderRadius: '12px', border: '2px solid #e0dcd3' }}>
                  <QRCodeSVG
                    id="ticket-qr"
                    value={JSON.stringify({
                      id: ticket.id,
                      name: ticket.name,
                      from: ticket.from,
                      to: ticket.to,
                      date: ticket.date,
                      seats: ticket.seats
                    })}
                    size={180}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p style={{ margin: '12px 0 0 0', color: '#888', fontSize: '12px' }}>{ticket.id}</p>
              </div>

              {/* Download Button */}
              <button
                onClick={downloadTicket}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#0D1B3E',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '12px'
                }}
              >
                📥 टिकट डाउनलोड गर्नुहोस्
              </button>

              <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', margin: 0 }}>
                💡 स्क्रिनसट लिएर राख्नुहोस्
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
