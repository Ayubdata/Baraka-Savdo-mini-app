// src/pages/CategoryPage.js
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const UNIT_LABELS = {
  dona: 'dona',
  pachka: 'pachka',
  korobka: 'korobka',
  kg: 'kg'
}

function ProductCard({ product, onAdd }) {
  const [qty, setQty] = useState(product.min_order || 1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    onAdd(product, qty, product.unit)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price)
  }

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {/* Rasm */}
        <div style={{
          width: 80, height: 80, borderRadius: 12,
          background: '#F1F5F9', flexShrink: 0,
          overflow: 'hidden', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: 32 }}>📦</span>
          )}
        </div>

        {/* Ma'lumot */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{product.name}</h3>
          {product.description && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, lineHeight: 1.4 }}>
              {product.description}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
              {formatPrice(product.price_per_unit)}
            </span>
            <span style={{
              fontSize: 11, color: 'var(--text-muted)',
              background: '#F1F5F9', padding: '2px 6px', borderRadius: 6
            }}>
              / {UNIT_LABELS[product.unit]}
            </span>
          </div>
        </div>
      </div>

      {/* Miqdor va Qo'shish */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: 10, marginTop: 12, paddingTop: 12,
        borderTop: '1px solid var(--border)'
      }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          Min: {product.min_order} {UNIT_LABELS[product.unit]}
        </span>
        <div style={{
          display: 'flex', alignItems: 'center',
          border: '1.5px solid var(--border)', borderRadius: 10,
          overflow: 'hidden', flexShrink: 0
        }}>
          <button
            onClick={() => setQty(q => Math.max(product.min_order || 1, q - 1))}
            style={{
              width: 34, height: 34, border: 'none',
              background: '#F8FAFC', cursor: 'pointer',
              fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >−</button>
          <span style={{
            padding: '0 10px', fontSize: 15, fontWeight: 600, minWidth: 32, textAlign: 'center'
          }}>
            {qty}
          </span>
          <button
            onClick={() => setQty(q => q + 1)}
            style={{
              width: 34, height: 34, border: 'none',
              background: '#F8FAFC', cursor: 'pointer',
              fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >+</button>
        </div>

        <button
          onClick={handleAdd}
          className="btn btn-primary"
          style={{
            flex: 1, height: 36, padding: '0 12px',
            background: added ? 'var(--secondary)' : 'var(--primary)',
            transition: 'background 0.3s'
          }}
        >
          {added ? '✓ Qo\'shildi' : '+ Savatga'}
        </button>
      </div>
    </div>
  )
}

export default function CategoryPage({ cart, addToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').eq('id', id).single(),
      supabase.from('products').select('*').eq('category_id', id).eq('in_stock', true).order('id')
    ])
    setCategory(catRes.data)
    setProducts(prodRes.data || [])
    setLoading(false)
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            width: 38, height: 38, borderRadius: 10,
            border: '1.5px solid var(--border)', background: 'white',
            cursor: 'pointer', fontSize: 18, display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}
        >←</button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>
            {category?.icon} {category?.name_uz}
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{products.length} mahsulot</p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={() => navigate('/cart')}
            style={{
              marginLeft: 'auto', background: 'var(--primary)',
              color: 'white', border: 'none', borderRadius: 10,
              padding: '8px 14px', cursor: 'pointer',
              fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            🛒 {cart.length}
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div className="loader" style={{ margin: '0 auto' }}></div>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p>Hozircha mahsulot yo'q</p>
        </div>
      ) : (
        products.map(product => (
          <ProductCard key={product.id} product={product} onAdd={addToCart} />
        ))
      )}
    </div>
  )
}
