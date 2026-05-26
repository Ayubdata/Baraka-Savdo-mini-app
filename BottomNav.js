import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/', label: 'Katalog', icon: '🏪' },
  { path: '/cart', label: 'Savat', icon: '🛒' },
  { path: '/orders', label: 'Buyurtmalar', icon: '📋' },
]

export default function BottomNav({ cartCount }) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(0,197,110,0.12)',
      display: 'flex',
      height: 'var(--nav-height)',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
      boxShadow: '0 -4px 30px rgba(0,197,110,0.08)'
    }}>
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path ||
          (tab.path !== '/' && location.pathname.startsWith(tab.path))

        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1, border: 'none', background: 'none',
              cursor: 'pointer', display: 'flex',
              flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 4,
              position: 'relative', transition: 'all 0.2s',
              padding: '8px 0'
            }}
          >
            {/* Active pill background */}
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 6, left: '50%',
                transform: 'translateX(-50%)',
                width: 48, height: 32,
                background: 'linear-gradient(135deg, rgba(0,197,110,0.15), rgba(0,135,90,0.1))',
                borderRadius: 10,
              }} />
            )}

            <div style={{ position: 'relative', fontSize: 22, zIndex: 1 }}>
              {tab.icon}
              {tab.path === '/cart' && cartCount > 0 && (
                <span className="badge" style={{
                  position: 'absolute', top: -6, right: -8,
                  fontSize: 9, minWidth: 16, height: 16,
                  boxShadow: '0 2px 6px rgba(255,71,87,0.4)'
                }}>
                  {cartCount}
                </span>
              )}
            </div>
            <span style={{
              fontSize: 10, fontWeight: isActive ? 800 : 500,
              color: isActive ? 'var(--primary-dark)' : 'var(--text-muted)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              zIndex: 1, letterSpacing: 0.2
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
