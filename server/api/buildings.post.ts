import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const filePath = join(process.cwd(), 'server', 'data', 'buildings.json')
  
  const data = await readFile(filePath, 'utf-8')
  const buildings = JSON.parse(data)
  
  // Check if building already exists
  if (buildings.some((b: any) => b.id === body.id)) {
    throw createError({ statusCode: 400, message: 'Корпус уже существует' })
  }
  
  const newBuilding = {
    id: body.id.toUpperCase(),
    name: body.name,
    floors: body.floors
  }
  
  buildings.push(newBuilding)
  await writeFile(filePath, JSON.stringify(buildings, null, 2))
  
  return newBuilding
})
