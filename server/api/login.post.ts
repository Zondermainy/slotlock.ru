import { query } from '~/server/utils/db'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { email, password } = body
  
  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Введите email и пароль' })
  }
  
  const result = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
  
  if (result.rows.length === 0) {
    throw createError({ statusCode: 401, message: 'Неверный email или пароль' })
  }
  
  const user = result.rows[0]
  
  if (user.is_blocked) {
    throw createError({ statusCode: 403, message: 'Ваш аккаунт заблокирован' })
  }
  
  const isValidPassword = await bcrypt.compare(password, user.password)
  
  if (!isValidPassword) {
    throw createError({ statusCode: 401, message: 'Неверный email или пароль' })
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    strikes: user.strikes,
    isBlocked: user.is_blocked
  }
})
