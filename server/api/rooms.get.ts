import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const result = await query('SELECT * FROM rooms ORDER BY building, floor, id')
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    type: row.type,
    building: row.building,
    floor: row.floor,
    location: row.location,
    capacity: row.capacity,
    amenities: row.amenities || [],
    isActive: row.is_active
  }))
})
