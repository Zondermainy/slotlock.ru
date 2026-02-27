import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const filePath = join(process.cwd(), 'server', 'data', 'buildings.json')
  
  const data = await readFile(filePath, 'utf-8')
  let buildings = JSON.parse(data)
  
  const index = buildings.findIndex((b: any) => b.id === id)
  
  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Корпус не найден' })
  }
  
  buildings.splice(index, 1)
  await writeFile(filePath, JSON.stringify(buildings, null, 2))
  
  return { success: true }
})
