import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  const result = await query('SELECT * FROM rooms WHERE id = $1', [id])
  
  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Комната не найдена' })
  }
  
  const row = result.rows[0]
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    building: row.building,
    floor: row.floor,
    location: row.location,
    capacity: row.capacity,
    amenities: row.amenities || [],
    isActive: row.is_active
  }
})
