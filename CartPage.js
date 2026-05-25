// src/pages/CartPage.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, tg } from '../lib/supabase'

export default function CartPage({ cart, user, removeFromCart, clearCart }) {
  const navigate = useNavigate()
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const formatPrice = (price) =>
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price)

  const total = cart.reduce((sum, item) => sum + (item.product.price_per_unit * item.quantity), 0)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const placeOrder = async () => {
    if (cart.length === 0) return
    setLoading(true)

    try {
      // 1. Buyurtma yaratish
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          note: note,
          status: 'pending'
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Buyurtma elementlarini saqlash
      const items = cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit: item.unit,
        price_per_unit: item.product.price_per_unit
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(items)

      if (itemsError) throw itemsError

      // 3. Telegram notification (bot webhook orqali)
      await fetch(`https://baraka-savdo-bot.onrender.com/notify-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: order.id,
          user,
          items: cart,
          total,
          note
        })
      }).catch(() => {}) // Bot xatosi buyurtmani bloklamas

      clearCart()
      tg?.HapticFeedback?.notificationOccurred('success')
      navigate('/orders')
      showToast('✓ Buyurtma muvaffaqiyatli berildi!')

    } catch (err) {
      showToast('❌ Xatolik yuz berdi. Qayta urinib ko\'ring.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Savat bo'sh</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Mahsulotlar qo'shing</p>
        <button className="btn btn-primary" style={{ maxWidth: 200 }} onClick={() => navigate('/')}>
          Katalogga o'tish
        </button>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>🛒 Savat</h1>
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{cart.length} ta mahsulot</span>
      </div>

      {/* Cart items */}
      {cart.map(item => (
        <div key={item.product.id} className="card" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 10,
              background: '#F1F5F9', overflow: 'hidden',
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {item.product.image_url
                ? <img src={item.product.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 24 }}>📦</span>
              }
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{item.product.name}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {item.quantity} {item.unit} × {formatPrice(item.product.price_per_unit)}
              </p>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
                {formatPrice(item.product.price_per_unit * item.quantity)}
              </p>
            </div>
            <button
              onClick={() => removeFromCart(item.product.id)}
              style={{
                width: 32, height: 32, borderRadius: 8, border: 'none',
                background: '#FEF2F2', color: 'var(--danger)',
                cursor: 'pointer', fontSize: 16, flexShrink: 0
              }}
            >✕</button>
          </div>
        </div>
      ))}

      {/* Izoh */}
      <div className="form-group" style={{ marginTop: 16 }}>
        <label>Izoh (ixtiyoriy)</label>
        <textarea
          placeholder="Yetkazib berish vaqti, maxsus talablar..."
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          style={{ resize: 'none' }}
        />
      </div>

      {/* Total */}
      <div className="card" style={{ marginTop: 8, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: 'var(--text-muted)' }}>Mahsulotlar ({cart.length})</span>
          <span style={{ fontWeight: 600 }}>{formatPrice(total)}</span>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Jami</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--primary)' }}>{formatPrice(total)}</span>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={placeOrder}
        disabled={loading}
        style={{ fontSize: 16, height: 52 }}
      >
        {loading ? 'Yuborilmoqda...' : '✓ Buyurtma berish'}
      </button>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
