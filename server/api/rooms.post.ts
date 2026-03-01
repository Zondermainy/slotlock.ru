import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const singleLetterBuildings = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'L', 'M', 'S']
  const isSingleLetter = singleLetterBuildings.includes(body.building)
  
  let location
  if (isSingleLetter) {
    location = `${body.building}${body.floor}, ${body.type === 'meeting' ? 'Переговорная' : 'Коворкинг'}`
  } else {
    location = `${body.building}, ${body.type === 'meeting' ? 'Переговорная' : 'Коворкинг'}`
  }
  
  const result = await query(
    `INSERT INTO rooms (id, name, type, building, floor, location, capacity, amenities, is_active) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [body.id, body.name, body.type, body.building, body.floor, location, body.capacity, body.amenities || [], true]
  )
  
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
