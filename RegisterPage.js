import React, { useState } from 'react'
import { supabase, getTelegramUser } from '../lib/supabase'

export default function RegisterPage({ onRegister }) {
  const [form, setForm] = useState({ full_name:'', phone:'', shop_name:'', shop_address:'', city:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const tgUser = getTelegramUser()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.full_name || !form.shop_name || !form.phone) {
      setError("Barcha majburiy maydonlarni to'ldiring")
      return
    }
    setLoading(true); setError('')
    try {
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously()
      if (authError) throw authError
      const { data, error: dbError } = await supabase.from('users').insert({
        id: authData.user.id, telegram_id: tgUser.id,
        full_name: form.full_name || `${tgUser.first_name} ${tgUser.last_name||''}`.trim(),
        phone: form.phone, shop_name: form.shop_name,
        shop_address: form.shop_address, city: form.city
      }).select().single()
      if (dbError) throw dbError
      onRegister(data)
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi")
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#00C56E,#005C3D)', display:'flex', flexDirection:'column' }}>
      {/* Top hero */}
      <div style={{ padding:'48px 24px 32px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
        <div style={{ position:'absolute', top:20, left:-40, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:52, marginBottom:16 }}>🛒</div>
          <h1 style={{ color:'white', fontSize:28, fontWeight:900, fontFamily:'Nunito,sans-serif', marginBottom:6 }}>
            Baraka Savdo
          </h1>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:14, fontWeight:500 }}>
            O'zbekistondan Koreyaga ulgurji yetkazib berish
          </p>
        </div>
      </div>

      {/* Form card */}
      <div style={{
        flex:1, background:'#F0FAF5', borderRadius:'28px 28px 0 0',
        padding:'28px 20px 40px',
        boxShadow:'0 -8px 40px rgba(0,0,0,0.15)'
      }}>
        <h2 style={{ fontSize:20, fontWeight:900, fontFamily:'Nunito,sans-serif', marginBottom:4 }}>
          Ro'yxatdan o'tish
        </h2>
        <p style={{ color:'var(--text-muted)', fontSize:13, marginBottom:24 }}>
          Do'kon ma'lumotlarini kiriting
        </p>

        {error && (
          <div style={{
            background:'#FFF0F1', border:'1px solid #FFCDD0', borderRadius:12,
            padding:'12px 16px', marginBottom:16, color:'var(--danger)', fontSize:14, fontWeight:500
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ism Familiya *</label>
            <input type="text" placeholder={`${tgUser.first_name} ${tgUser.last_name||''}`}
              value={form.full_name} onChange={e => setForm({...form, full_name:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Telefon raqam *</label>
            <input type="tel" placeholder="+82 10 0000 0000"
              value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Do'kon nomi *</label>
            <input type="text" placeholder="Seoul UzFood Market"
              value={form.shop_name} onChange={e => setForm({...form, shop_name:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Shahar</label>
            <select value={form.city} onChange={e => setForm({...form, city:e.target.value})}>
              <option value="">Shahringizni tanlang</option>
              <option>Seoul</option><option>Busan</option><option>Incheon</option>
              <option>Daegu</option><option>Daejeon</option><option>Gwangju</option>
              <option>Suwon</option><option value="Other">Boshqa</option>
            </select>
          </div>
          <div className="form-group">
            <label>Manzil</label>
            <input type="text" placeholder="Ko'cha, uy raqami"
              value={form.shop_address} onChange={e => setForm({...form, shop_address:e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop:8, height:52, fontSize:16 }}>
            {loading ? 'Saqlanmoqda...' : '✓ Ro\'yxatdan o\'tish'}
          </button>
        </form>
      </div>
    </div>
  )
}
