import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const filePath = join(process.cwd(), 'server', 'data', 'rooms.json')
  const data = await readFile(filePath, 'utf-8')
  const rooms = JSON.parse(data)
  const room = rooms.find((r: any) => r.id === id)
  
  if (!room) {
    throw createError({ statusCode: 404, message: 'Комната не найдена' })
  }
  
  return room
})
