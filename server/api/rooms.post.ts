import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const filePath = join(process.cwd(), 'server', 'data', 'rooms.json')
  
  const data = await readFile(filePath, 'utf-8')
  const rooms = JSON.parse(data)
  
  const newRoom = {
    id: body.id,
    name: body.name,
    location: 'А11, Библиотека',
    capacity: body.capacity,
    amenities: body.amenities || [],
    isActive: true
  }
  
  rooms.push(newRoom)
  await writeFile(filePath, JSON.stringify(rooms, null, 2))
  
  return newRoom
})
