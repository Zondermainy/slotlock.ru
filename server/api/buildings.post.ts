import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const existing = await query('SELECT id FROM buildings WHERE id = $1', [body.id.toUpperCase()])
  if (existing.rows.length > 0) {
    throw createError({ statusCode: 400, message: 'Корпус уже существует' })
  }
  
  const result = await query(
    'INSERT INTO buildings (id, name, floors) VALUES ($1, $2, $3) RETURNING *',
    [body.id.toUpperCase(), body.name, body.floors]
  )
  
  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    floors: result.rows[0].floors
  }
})
