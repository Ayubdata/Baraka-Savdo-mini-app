// src/pages/OrdersPage.js
import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const STATUS = {
  pending:   { label: 'Kutilmoqda', emoji: '⏳' },
  confirmed: { label: 'Tasdiqlandi', emoji: '✅' },
  shipped:   { label: 'Jo\'natildi', emoji: '🚚' },
  delivered: { label: 'Yetkazildi', emoji: '🎉' },
  cancelled: { label: 'Bekor qilindi', emoji: '❌' },
}

export default function OrdersPage({ user }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (name, unit)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const formatPrice = (price) =>
    price ? new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price) : '—'

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 60 }}>
      <div className="loader" style={{ margin: '0 auto' }}></div>
    </div>
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1>📋 Buyurtmalarim</h1>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 16 }}>Hali buyurtma yo'q</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>Katalogdan mahsulot tanlang</p>
        </div>
      ) : (
        orders.map(order => {
          const st = STATUS[order.status] || STATUS.pending
          const isExpanded = expanded === order.id
          return (
            <div
              key={order.id}
              className="card"
              style={{ marginBottom: 12, cursor: 'pointer' }}
              onClick={() => setExpanded(isExpanded ? null : order.id)}
            >
              {/* Sarlavha */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>Buyurtma #{order.id}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`status-badge status-${order.status}`}>
                    {st.emoji} {st.label}
                  </span>
                  <p style={{ fontWeight: 700, fontSize: 15, marginTop: 4, color: 'var(--primary)' }}>
                    {formatPrice(order.total_amount)}
                  </p>
                </div>
              </div>

              {/* Kengaytirilgan ko'rinish */}
              {isExpanded && order.order_items && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  {order.order_items.map(item => (
                    <div key={item.id} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '6px 0', borderBottom: '1px solid var(--border)'
                    }}>
                      <span style={{ fontSize: 13 }}>
                        {item.products?.name} ({item.quantity} {item.unit})
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  ))}
                  {order.note && (
                    <p style={{ marginTop: 10, fontSize: 13, color: 'var(--text-muted)' }}>
                      💬 {order.note}
                    </p>
                  )}
                </div>
              )}

              <div style={{
                textAlign: 'right', marginTop: 8,
                fontSize: 12, color: 'var(--text-muted)'
              }}>
                {isExpanded ? '▲ Yig\'ish' : '▼ Batafsil'}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
