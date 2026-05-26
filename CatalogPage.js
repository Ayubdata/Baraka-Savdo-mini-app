import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, getTelegramUser } from '../lib/supabase'

const CATEGORY_STYLES = {
  dairy:      { grad: 'linear-gradient(135deg,#E0F7FA,#B2EBF2)', icon: '🥛', accent: '#00ACC1' },
  flour:      { grad: 'linear-gradient(135deg,#FFF8E1,#FFECB3)', icon: '🌾', accent: '#F9A825' },
  sweets:     { grad: 'linear-gradient(135deg,#FCE4EC,#F8BBD0)', icon: '🍬', accent: '#E91E8C' },
  tea_coffee: { grad: 'linear-gradient(135deg,#FBE9E7,#FFCCBC)', icon: '☕', accent: '#BF360C' },
  spices:     { grad: 'linear-gradient(135deg,#FFF3E0,#FFE0B2)', icon: '🌶️', accent: '#E65100' },
  mixed:      { grad: 'linear-gradient(135deg,#E8F5E9,#C8E6C9)', icon: '📦', accent: '#2E7D32' },
}

export default function CatalogPage({ cart }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const tgUser = getTelegramUser()

  useEffect(() => { loadCategories() }, [])

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    setCategories(data || [])
    setLoading(false)
  }

  return (
    <div className="page" style={{ padding: '0 0 90px' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(160deg, #00C56E 0%, #00875A 60%, #005C3D 100%)',
        padding: '28px 20px 36px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
        <div style={{ position:'absolute', bottom:-60, left:-20, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>

        <div style={{ position:'relative', zIndex:1 }}>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, fontWeight:600, marginBottom:4 }}>Salom 👋</p>
          <h1 style={{
            color:'white', fontSize:24, fontWeight:900,
            fontFamily:'Nunito, sans-serif', marginBottom:16, lineHeight:1.2
          }}>
            {tgUser.first_name}
          </h1>

          {/* Stats row */}
          <div style={{ display:'flex', gap:10 }}>
            <div style={{
              background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)',
              borderRadius:14, padding:'10px 16px', border:'1px solid rgba(255,255,255,0.2)'
            }}>
              <p style={{ color:'rgba(255,255,255,0.8)', fontSize:11, fontWeight:600 }}>SAVAT</p>
              <p style={{ color:'white', fontSize:20, fontWeight:900, fontFamily:'Nunito,sans-serif' }}>{cart.length}</p>
            </div>
            <div
              onClick={() => navigate('/cart')}
              style={{
                background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)',
                borderRadius:14, padding:'10px 16px', border:'1px solid rgba(255,255,255,0.2)',
                cursor:'pointer', flex:1, display:'flex', alignItems:'center', justifyContent:'space-between'
              }}
            >
              <div>
                <p style={{ color:'rgba(255,255,255,0.8)', fontSize:11, fontWeight:600 }}>O'ZBEKISTONDAN</p>
                <p style={{ color:'white', fontSize:13, fontWeight:700 }}>Ulgurji mahsulotlar 🇺🇿</p>
              </div>
              <span style={{ color:'white', fontSize:20 }}>→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding:'24px 16px 0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <h2 style={{ fontSize:19, fontWeight:900, fontFamily:'Nunito,sans-serif' }}>Kategoriyalar</h2>
          <span style={{ fontSize:13, color:'var(--text-muted)', fontWeight:600 }}>{categories.length} ta</span>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:40 }}>
            <div className="loader" style={{ margin:'0 auto' }}></div>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {categories.map((cat, i) => {
              const s = CATEGORY_STYLES[cat.name] || CATEGORY_STYLES.mixed
              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/category/${cat.id}`)}
                  style={{
                    background: s.grad,
                    borderRadius: 20,
                    padding: 18,
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    border: `1.5px solid rgba(0,0,0,0.04)`,
                    animation: `fadeUp 0.4s ease ${i * 0.06}s both`
                  }}
                  onTouchStart={e => { e.currentTarget.style.transform='scale(0.96)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)' }}
                  onTouchEnd={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none' }}
                >
                  <div style={{ fontSize:36, marginBottom:10 }}>{cat.icon || s.icon}</div>
                  <p style={{
                    fontWeight:800, fontSize:14, lineHeight:1.3,
                    fontFamily:'Nunito,sans-serif', color:'#1a1a1a', marginBottom:6
                  }}>{cat.name_uz}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <span style={{ fontSize:11, fontWeight:700, color: s.accent }}>Ko'rish</span>
                    <span style={{ fontSize:11, color: s.accent }}>→</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
