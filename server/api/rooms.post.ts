import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const filePath = join(process.cwd(), 'server', 'data', 'rooms.json')
  
  const data = await readFile(filePath, 'utf-8')
  const rooms = JSON.parse(data)
  
  // For single-letter buildings (A, B, C...), append floor. For S1, S2, etc, don't add floor
  const singleLetterBuildings = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'L', 'M', 'S']
  const isSingleLetter = singleLetterBuildings.includes(body.building)
  
  let location
  if (isSingleLetter) {
    location = `${body.building}${body.floor}, ${body.type === 'meeting' ? 'Переговорная' : 'Коворкинг'}`
  } else {
    location = `${body.building}, ${body.type === 'meeting' ? 'Переговорная' : 'Коворкинг'}`
  }
  
  const newRoom = {
    id: body.id,
    name: body.name,
    type: body.type,
    building: body.building,
    floor: body.floor,
    locationType: body.locationType || null,
    location: location,
    capacity: body.capacity,
    amenities: body.amenities || [],
    isActive: true
  }
  
  rooms.push(newRoom)
  await writeFile(filePath, JSON.stringify(rooms, null, 2))
  
  return newRoom
})
