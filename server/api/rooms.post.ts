import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const filePath = join(process.cwd(), 'server', 'data', 'rooms.json')
  
  const data = await readFile(filePath, 'utf-8')
  const rooms = JSON.parse(data)
  
  const location = `${body.building}${body.floor}, ${body.type === 'meeting' ? 'Переговорная' : 'Коворкинг'}`
  
  const newRoom = {
    id: body.id,
    name: body.name,
    type: body.type,
    building: body.building,
    floor: body.floor,
    location: location,
    capacity: body.capacity,
    amenities: body.amenities || [],
    isActive: true
  }
  
  rooms.push(newRoom)
  await writeFile(filePath, JSON.stringify(rooms, null, 2))
  
  return newRoom
})
