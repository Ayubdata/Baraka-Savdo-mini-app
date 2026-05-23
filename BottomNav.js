// src/components/BottomNav.js
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
      background: 'white',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      height: 'var(--nav-height)',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)'
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
              justifyContent: 'center', gap: 3,
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              position: 'relative', transition: 'color 0.2s'
            }}
          >
            <div style={{ position: 'relative', fontSize: 22 }}>
              {tab.icon}
              {tab.path === '/cart' && cartCount > 0 && (
                <span className="badge" style={{
                  position: 'absolute', top: -6, right: -8,
                  fontSize: 10, minWidth: 16, height: 16
                }}>
                  {cartCount}
                </span>
              )}
            </div>
            <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 400 }}>
              {tab.label}
            </span>
            {isActive && (
              <div style={{
                position: 'absolute', top: 0, left: '50%',
                transform: 'translateX(-50%)',
                width: 32, height: 3,
                background: 'var(--primary)',
                borderRadius: '0 0 4px 4px'
              }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}
