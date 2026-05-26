import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const STATUS = {
  pending:   { label:'Kutilmoqda', emoji:'⏳', color:'#B45309', bg:'#FFFBEB' },
  confirmed: { label:'Tasdiqlandi', emoji:'✅', color:'#00875A', bg:'#ECFDF5' },
  shipped:   { label:'Jo\'natildi', emoji:'🚚', color:'#6D28D9', bg:'#F5F3FF' },
  delivered: { label:'Yetkazildi', emoji:'🎉', color:'#00C56E', bg:'#D1FAE5' },
  cancelled: { label:'Bekor', emoji:'❌', color:'#FF4757', bg:'#FFF0F1' },
}

export default function OrdersPage({ user }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => { loadOrders() }, [])

  const loadOrders = async () => {
    const { data } = await supabase.from('orders')
      .select('*, order_items(*, products(name, unit))')
      .eq('user_id', user.id).order('created_at', { ascending: false })
    setOrders(data || []); setLoading(false)
  }

  const formatPrice = p => p ? new Intl.NumberFormat('ko-KR', { style:'currency', currency:'KRW' }).format(p) : '—'
  const formatDate = d => new Date(d).toLocaleDateString('uz-UZ', { day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })

  if (loading) return <div className="page" style={{ textAlign:'center', paddingTop:80 }}><div className="loader" style={{ margin:'0 auto' }}/></div>

  return (
    <div className="page">
      <h1 style={{ fontSize:22, fontWeight:900, fontFamily:'Nunito,sans-serif', marginBottom:20 }}>📋 Buyurtmalarim</h1>

      {!orders.length ? (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-muted)' }}>
          <div style={{ fontSize:60, marginBottom:16 }}>📭</div>
          <p style={{ fontSize:17, fontWeight:800, fontFamily:'Nunito,sans-serif', marginBottom:6 }}>Hali buyurtma yo'q</p>
          <p style={{ fontSize:13 }}>Katalogdan mahsulot tanlang</p>
        </div>
      ) : orders.map(order => {
        const st = STATUS[order.status] || STATUS.pending
        const isExp = expanded === order.id
        return (
          <div key={order.id} onClick={() => setExpanded(isExp ? null : order.id)}
            style={{
              background:'white', borderRadius:20, marginBottom:12, overflow:'hidden',
              boxShadow:'0 2px 16px rgba(0,197,110,0.08)', border:'1px solid rgba(0,197,110,0.08)',
              cursor:'pointer'
            }}>
            <div style={{ padding:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <p style={{ fontWeight:900, fontSize:16, fontFamily:'Nunito,sans-serif' }}>Buyurtma #{order.id}</p>
                  <p style={{ fontSize:12, color:'var(--text-muted)', fontWeight:500, marginTop:2 }}>{formatDate(order.created_at)}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <span style={{
                    display:'inline-block', padding:'5px 12px', borderRadius:20,
                    fontSize:12, fontWeight:700, color: st.color, background: st.bg
                  }}>{st.emoji} {st.label}</span>
                  <p style={{ fontWeight:900, fontSize:17, color:'var(--primary-dark)', fontFamily:'Nunito,sans-serif', marginTop:4 }}>
                    {formatPrice(order.total_amount)}
                  </p>
                </div>
              </div>
            </div>

            {isExp && order.order_items && (
              <div style={{ borderTop:'1px solid var(--border)', background:'rgba(240,250,245,0.5)', padding:'12px 16px' }}>
                {order.order_items.map(item => (
                  <div key={item.id} style={{
                    display:'flex', justifyContent:'space-between',
                    padding:'7px 0', borderBottom:'1px solid rgba(0,197,110,0.08)'
                  }}>
                    <span style={{ fontSize:13, fontWeight:600 }}>{item.products?.name} ({item.quantity} {item.unit})</span>
                    <span style={{ fontSize:13, fontWeight:800, color:'var(--primary-dark)' }}>{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
                {order.note && <p style={{ marginTop:10, fontSize:13, color:'var(--text-muted)', fontWeight:500 }}>💬 {order.note}</p>}
              </div>
            )}

            <div style={{ padding:'8px 16px', textAlign:'right', borderTop: isExp ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600 }}>{isExp ? '▲ Yig\'ish' : '▼ Batafsil'}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
