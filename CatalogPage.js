// src/pages/CatalogPage.js
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, getTelegramUser } from '../lib/supabase'

export default function CatalogPage({ cart }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const tgUser = getTelegramUser()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')
    setCategories(data || [])
    setLoading(false)
  }

  const categoryColors = {
    dairy: { bg: '#EFF6FF', border: '#BFDBFE', icon: '🥛' },
    flour: { bg: '#FFF7ED', border: '#FED7AA', icon: '🌾' },
    sweets: { bg: '#FDF4FF', border: '#E9D5FF', icon: '🍬' },
    tea_coffee: { bg: '#FFF1F2', border: '#FECDD3', icon: '☕' },
    spices: { bg: '#FFF7ED', border: '#FDBA74', icon: '🌶️' },
    mixed: { bg: '#F0FDF4', border: '#BBF7D0', icon: '📦' },
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Salom 👋</p>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>{tgUser.first_name}</h1>
          </div>
          <div style={{
            background: 'var(--primary)', color: 'white',
            borderRadius: 12, padding: '8px 14px', fontSize: 13, fontWeight: 600
          }}>
            🛒 {cart.length} mahsulot
          </div>
        </div>
      </div>

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
        borderRadius: 16, padding: 20, marginBottom: 24, color: 'white'
      }}>
        <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>O'zbekistondan Koreyaga</p>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Ulgurji oziq-ovqat</h2>
        <p style={{ fontSize: 13, opacity: 0.9 }}>Dona, pachka, korobka yoki kg hisobida buyurtma bering</p>
      </div>

      {/* Categories */}
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>Kategoriyalar</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div className="loader" style={{ margin: '0 auto' }}></div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {categories.map(cat => {
            const style = categoryColors[cat.name] || { bg: '#F8FAFC', border: '#E2E8F0', icon: '📦' }
            return (
              <div
                key={cat.id}
                onClick={() => navigate(`/category/${cat.id}`)}
                style={{
                  background: style.bg,
                  border: `1.5px solid ${style.border}`,
                  borderRadius: 16,
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'transform 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
                onTouchStart={e => e.currentTarget.style.transform = 'scale(0.97)'}
                onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span style={{ fontSize: 32 }}>{cat.icon || style.icon}</span>
                <p style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{cat.name_uz}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Mahsulotlarni ko'rish →</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
