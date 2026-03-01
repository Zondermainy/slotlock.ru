import { query } from '~/server/utils/db'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { email, password, name } = body
  
  if (!email || !password || !name) {
    throw createError({ statusCode: 400, message: 'Заполните все поля' })
  }
  
  if (!email.toLowerCase().endsWith('@dvfu.ru')) {
    throw createError({ statusCode: 400, message: 'Email должен заканчиваться на @dvfu.ru' })
  }
  
  if (password.length < 8) {
    throw createError({ statusCode: 400, message: 'Пароль должен быть не менее 8 символов' })
  }
  
  const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
  if (existing.rows.length > 0) {
    throw createError({ statusCode: 400, message: 'Пользователь с таким email уже существует' })
  }
  
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const result = await query(
    'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
    [email.toLowerCase(), hashedPassword, name, 'user']
  )
  
  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    name: result.rows[0].name,
    role: result.rows[0].role
  }
})
