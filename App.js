// src/App.js
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase, tg, getTelegramUser } from './lib/supabase'
import RegisterPage from './pages/RegisterPage'
import CatalogPage from './pages/CatalogPage'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import BottomNav from './components/BottomNav'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])

  useEffect(() => {
    // Telegram WebApp ni ishga tushirish
    if (tg) {
      tg.ready()
      tg.expand()
      tg.setHeaderColor('#1a1a2e')
    }
    checkUser()
  }, [])

  const checkUser = async () => {
    const tgUser = getTelegramUser()
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', tgUser.id)
        .single()
      setUser(data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product, quantity, unit) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { product, quantity, unit }]
    })
    // Telegram haptic feedback
    tg?.HapticFeedback?.impactOccurred('light')
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.product.id !== productId))
  }

  const clearCart = () => setCart([])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route
            path="/register"
            element={
              user ? <Navigate to="/" /> :
              <RegisterPage onRegister={setUser} />
            }
          />
          <Route
            path="/"
            element={
              !user ? <Navigate to="/register" /> :
              <CatalogPage cart={cart} />
            }
          />
          <Route
            path="/category/:id"
            element={
              !user ? <Navigate to="/register" /> :
              <CategoryPage cart={cart} addToCart={addToCart} />
            }
          />
          <Route
            path="/cart"
            element={
              !user ? <Navigate to="/register" /> :
              <CartPage
                cart={cart}
                user={user}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
              />
            }
          />
          <Route
            path="/orders"
            element={
              !user ? <Navigate to="/register" /> :
              <OrdersPage user={user} />
            }
          />
        </Routes>

        {user && <BottomNav cartCount={cart.length} />}
      </div>
    </BrowserRouter>
  )
}
