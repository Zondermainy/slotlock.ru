import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const filePath = join(process.cwd(), 'server', 'data', 'amenities.json')
  
  const data = await readFile(filePath, 'utf-8')
  const amenities = JSON.parse(data)
  
  const filtered = amenities.filter((a: any) => a.id !== id)
  await writeFile(filePath, JSON.stringify(filtered, null, 2))
  
  return { success: true }
})
