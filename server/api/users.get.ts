import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const result = await query('SELECT * FROM users ORDER BY id')
  return result.rows.map(row => ({
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    strikes: row.strikes,
    isBlocked: row.is_blocked
  }))
})
