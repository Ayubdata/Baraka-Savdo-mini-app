// src/pages/RegisterPage.js
import React, { useState } from 'react'
import { supabase, getTelegramUser } from '../lib/supabase'

export default function RegisterPage({ onRegister }) {
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    shop_name: '',
    shop_address: '',
    city: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const tgUser = getTelegramUser()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.full_name || !form.shop_name || !form.phone) {
      setError("Iltimos barcha majburiy maydonlarni to'ldiring")
      return
    }
    setLoading(true)
    setError('')

    try {
      // Supabase Auth - anonymous sign in (Telegram ID asosida)
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously()
      if (authError) throw authError

      // Foydalanuvchini saqlash
      const { data, error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          telegram_id: tgUser.id,
          full_name: form.full_name || `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
          phone: form.phone,
          shop_name: form.shop_name,
          shop_address: form.shop_address,
          city: form.city
        })
        .select()
        .single()

      if (dbError) throw dbError
      onRegister(data)
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi. Qayta urinib ko'ring.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28, paddingTop: 16 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🛒</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
          O'zbekiston Oziq-ovqat
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Ulgurji mahsulotlar — Koreya bo'ylab yetkazib berish
        </p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
          Ro'yxatdan o'tish
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
          Do'kon ma'lumotlarini kiriting
        </p>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            color: 'var(--danger)', fontSize: 14
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ism Familiya *</label>
            <input
              type="text"
              placeholder={`${tgUser.first_name} ${tgUser.last_name || ''}`}
              value={form.full_name}
              onChange={e => setForm({...form, full_name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Telefon raqam *</label>
            <input
              type="tel"
              placeholder="+82 10 0000 0000"
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Do'kon nomi *</label>
            <input
              type="text"
              placeholder="Masalan: Seoul UzFood Market"
              value={form.shop_name}
              onChange={e => setForm({...form, shop_name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Shahar</label>
            <select
              value={form.city}
              onChange={e => setForm({...form, city: e.target.value})}
            >
              <option value="">Shahringizni tanlang</option>
              <option value="Seoul">Seoul (Seul)</option>
              <option value="Busan">Busan (Pusan)</option>
              <option value="Incheon">Incheon</option>
              <option value="Daegu">Daegu</option>
              <option value="Daejeon">Daejeon</option>
              <option value="Gwangju">Gwangju</option>
              <option value="Suwon">Suwon</option>
              <option value="Other">Boshqa shahar</option>
            </select>
          </div>

          <div className="form-group">
            <label>Do'kon manzili</label>
            <input
              type="text"
              placeholder="Ko'cha, uy raqami"
              value={form.shop_address}
              onChange={e => setForm({...form, shop_address: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Saqlanmoqda...' : '✓ Ro\'yxatdan o\'tish'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, marginTop: 16 }}>
        Ro'yxatdan o'tib buyurtma bera olasiz
      </p>
    </div>
  )
}
