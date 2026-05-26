import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, tg } from '../lib/supabase'

export default function CartPage({ cart, user, removeFromCart, clearCart }) {
  const navigate = useNavigate()
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const formatPrice = p => new Intl.NumberFormat('ko-KR', { style:'currency', currency:'KRW' }).format(p)
  const total = cart.reduce((s, i) => s + i.product.price_per_unit * i.quantity, 0)

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const placeOrder = async () => {
    if (!cart.length) return
    setLoading(true)
    try {
      const { data: order, error: orderError } = await supabase.from('orders')
        .insert({ user_id: user.id, note, status: 'pending' }).select().single()
      if (orderError) throw orderError
      const { error: itemsError } = await supabase.from('order_items').insert(
        cart.map(i => ({ order_id: order.id, product_id: i.product.id, quantity: i.quantity, unit: i.unit, price_per_unit: i.product.price_per_unit }))
      )
      if (itemsError) throw itemsError
      clearCart()
      tg?.HapticFeedback?.notificationOccurred('success')
      navigate('/orders')
    } catch (err) {
      showToast('❌ Xatolik yuz berdi')
    } finally { setLoading(false) }
  }

  if (!cart.length) return (
    <div className="page" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'70vh' }}>
      <div style={{ fontSize:72, marginBottom:16 }}>🛒</div>
      <h2 style={{ fontSize:22, fontWeight:900, fontFamily:'Nunito,sans-serif', marginBottom:8 }}>Savat bo'sh</h2>
      <p style={{ color:'var(--text-muted)', marginBottom:28 }}>Mahsulotlar qo'shing</p>
      <button className="btn btn-primary" style={{ maxWidth:200 }} onClick={() => navigate('/')}>Katalogga o'tish</button>
    </div>
  )

  return (
    <div className="page">
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <h1 style={{ fontSize:22, fontWeight:900, fontFamily:'Nunito,sans-serif' }}>🛒 Savat</h1>
        <span style={{ color:'var(--text-muted)', fontSize:14, fontWeight:600 }}>{cart.length} ta</span>
      </div>

      {cart.map(item => (
        <div key={item.product.id} style={{
          background:'white', borderRadius:18, marginBottom:10, padding:14,
          boxShadow:'0 2px 12px rgba(0,197,110,0.08)', border:'1px solid rgba(0,197,110,0.08)',
          display:'flex', alignItems:'center', gap:12
        }}>
          <div style={{
            width:54, height:54, borderRadius:12,
            background:'linear-gradient(135deg,#E8F5E9,#C8E6C9)',
            overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center'
          }}>
            {item.product.image_url
              ? <img src={item.product.image_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <span style={{ fontSize:26 }}>📦</span>
            }
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:800, fontSize:14, fontFamily:'Nunito,sans-serif', marginBottom:2 }}>{item.product.name}</p>
            <p style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600 }}>
              {item.quantity} {item.unit} × {formatPrice(item.product.price_per_unit)}
            </p>
            <p style={{ fontSize:15, fontWeight:900, color:'var(--primary-dark)', fontFamily:'Nunito,sans-serif' }}>
              {formatPrice(item.product.price_per_unit * item.quantity)}
            </p>
          </div>
          <button onClick={() => removeFromCart(item.product.id)} style={{
            width:34, height:34, borderRadius:10, border:'none',
            background:'#FFF0F1', color:'var(--danger)', cursor:'pointer', fontSize:16, flexShrink:0
          }}>✕</button>
        </div>
      ))}

      <div className="form-group" style={{ marginTop:16 }}>
        <label>Izoh (ixtiyoriy)</label>
        <textarea placeholder="Yetkazib berish vaqti, maxsus talablar..." value={note}
          onChange={e => setNote(e.target.value)} rows={3} style={{ resize:'none' }} />
      </div>

      <div style={{
        background:'white', borderRadius:18, padding:16, marginBottom:16,
        boxShadow:'0 2px 12px rgba(0,197,110,0.08)', border:'1px solid rgba(0,197,110,0.08)'
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
          <span style={{ color:'var(--text-muted)', fontWeight:600 }}>Mahsulotlar ({cart.length})</span>
          <span style={{ fontWeight:700 }}>{formatPrice(total)}</span>
        </div>
        <div style={{ borderTop:'1px solid var(--border)', paddingTop:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontWeight:800, fontSize:16, fontFamily:'Nunito,sans-serif' }}>Jami</span>
          <span style={{ fontWeight:900, fontSize:22, color:'var(--primary-dark)', fontFamily:'Nunito,sans-serif' }}>{formatPrice(total)}</span>
        </div>
      </div>

      <button className="btn btn-primary" onClick={placeOrder} disabled={loading} style={{ fontSize:16, height:54 }}>
        {loading ? 'Yuborilmoqda...' : '✓ Buyurtma berish'}
      </button>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
