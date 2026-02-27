import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const filePath = join(process.cwd(), 'server', 'data', 'rooms.json')
  
  const data = await readFile(filePath, 'utf-8')
  let rooms = JSON.parse(data)
  
  const index = rooms.findIndex((r: any) => r.id === id)
  
  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Комната не найдена' })
  }
  
  rooms.splice(index, 1)
  await writeFile(filePath, JSON.stringify(rooms, null, 2))
  
  return { success: true }
})
