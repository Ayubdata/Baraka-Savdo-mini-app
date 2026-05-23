// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Telegram WebApp objecti
export const tg = window.Telegram?.WebApp

// Telegram foydalanuvchi ma'lumotlarini olish
export const getTelegramUser = () => {
  if (tg?.initDataUnsafe?.user) {
    return tg.initDataUnsafe.user
  }
  // Development uchun test user
  return { id: 123456789, first_name: 'Test', last_name: 'User' }
}
