import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const result = await query('SELECT * FROM buildings ORDER BY id')
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    floors: row.floors
  }))
})
