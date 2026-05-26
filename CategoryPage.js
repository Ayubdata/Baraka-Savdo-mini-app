import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const UNIT_LABELS = { dona:'dona', pachka:'pachka', korobka:'korobka', kg:'kg' }

function ProductCard({ product, onAdd }) {
  const [qty, setQty] = useState(product.min_order || 1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    onAdd(product, qty, product.unit)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const formatPrice = p => new Intl.NumberFormat('ko-KR', { style:'currency', currency:'KRW' }).format(p)

  return (
    <div style={{
      background:'white', borderRadius:20, marginBottom:12, overflow:'hidden',
      boxShadow:'0 2px 16px rgba(0,197,110,0.08)', border:'1px solid rgba(0,197,110,0.08)',
      animation:'fadeUp 0.35s ease both'
    }}>
      <div style={{ display:'flex', gap:14, padding:16 }}>
        <div style={{
          width:82, height:82, borderRadius:14, background:'linear-gradient(135deg,#E8F5E9,#C8E6C9)',
          flexShrink:0, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          {product.image_url
            ? <img src={product.image_url} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            : <span style={{ fontSize:34 }}>📦</span>
          }
        </div>
        <div style={{ flex:1 }}>
          <h3 style={{ fontSize:15, fontWeight:800, fontFamily:'Nunito,sans-serif', marginBottom:4, lineHeight:1.3 }}>{product.name}</h3>
          {product.description && (
            <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:8, lineHeight:1.5 }}>{product.description}</p>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:17, fontWeight:900, color:'var(--primary-dark)', fontFamily:'Nunito,sans-serif' }}>
              {formatPrice(product.price_per_unit)}
            </span>
            <span style={{
              fontSize:11, fontWeight:700, color:'var(--text-muted)',
              background:'var(--bg)', padding:'3px 8px', borderRadius:8
            }}>/ {UNIT_LABELS[product.unit]}</span>
          </div>
        </div>
      </div>

      <div style={{
        display:'flex', alignItems:'center', gap:10,
        padding:'12px 16px', borderTop:'1px solid rgba(0,197,110,0.08)',
        background:'rgba(240,250,245,0.5)'
      }}>
        <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600, whiteSpace:'nowrap' }}>
          Min: {product.min_order} {UNIT_LABELS[product.unit]}
        </span>
        <div style={{
          display:'flex', alignItems:'center',
          background:'white', border:'1.5px solid var(--border)',
          borderRadius:12, overflow:'hidden', flexShrink:0
        }}>
          <button onClick={() => setQty(q => Math.max(product.min_order||1, q-1))}
            style={{ width:36, height:36, border:'none', background:'none', cursor:'pointer', fontSize:18, fontWeight:700, color:'var(--primary-dark)' }}>−</button>
          <span style={{ padding:'0 10px', fontSize:15, fontWeight:800, minWidth:30, textAlign:'center', fontFamily:'Nunito,sans-serif' }}>{qty}</span>
          <button onClick={() => setQty(q => q+1)}
            style={{ width:36, height:36, border:'none', background:'none', cursor:'pointer', fontSize:18, fontWeight:700, color:'var(--primary-dark)' }}>+</button>
        </div>
        <button onClick={handleAdd} className="btn btn-primary" style={{
          flex:1, height:38, padding:'0 12px', fontSize:13,
          background: added ? 'linear-gradient(135deg,#00A85D,#007A42)' : 'linear-gradient(135deg,#00C56E,#00875A)',
          boxShadow: added ? 'none' : '0 3px 12px rgba(0,197,110,0.3)'
        }}>
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

  useEffect(() => { loadData() }, [id])

  const loadData = async () => {
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').eq('id', id).single(),
      supabase.from('products').select('*').eq('category_id', id).eq('in_stock', true).order('id')
    ])
    setCategory(catRes.data); setProducts(prodRes.data || []); setLoading(false)
  }

  return (
    <div className="page" style={{ padding:0, paddingBottom:90 }}>
      {/* Header */}
      <div style={{
        background:'linear-gradient(160deg,#00C56E,#00875A)',
        padding:'20px 16px 24px', position:'relative', overflow:'hidden'
      }}>
        <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative', zIndex:1 }}>
          <button onClick={() => navigate('/')} style={{
            width:40, height:40, borderRadius:12, border:'1.5px solid rgba(255,255,255,0.3)',
            background:'rgba(255,255,255,0.15)', cursor:'pointer', fontSize:18, color:'white',
            display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(10px)'
          }}>←</button>
          <div style={{ flex:1 }}>
            <h1 style={{ color:'white', fontSize:20, fontWeight:900, fontFamily:'Nunito,sans-serif' }}>
              {category?.icon} {category?.name_uz}
            </h1>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:12, fontWeight:600 }}>{products.length} mahsulot</p>
          </div>
          {cart.length > 0 && (
            <button onClick={() => navigate('/cart')} style={{
              background:'rgba(255,255,255,0.2)', border:'1.5px solid rgba(255,255,255,0.3)',
              borderRadius:12, padding:'8px 14px', cursor:'pointer', color:'white',
              fontWeight:700, fontSize:13, backdropFilter:'blur(10px)'
            }}>🛒 {cart.length}</button>
          )}
        </div>
      </div>

      <div style={{ padding:'16px 16px 0' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:60 }}><div className="loader" style={{ margin:'0 auto' }}/></div>
        ) : products.length === 0 ? (
          <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}>
            <div style={{ fontSize:56, marginBottom:12 }}>📭</div>
            <p style={{ fontWeight:700 }}>Hozircha mahsulot yo'q</p>
          </div>
        ) : (
          products.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)
        )}
      </div>
    </div>
  )
}
