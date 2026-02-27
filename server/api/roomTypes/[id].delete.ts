import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const filePath = join(process.cwd(), 'server', 'data', 'roomTypes.json')
  
  const data = await readFile(filePath, 'utf-8')
  const types = JSON.parse(data)
  
  const filtered = types.filter((t: any) => t.id !== id)
  await writeFile(filePath, JSON.stringify(filtered, null, 2))
  
  return { success: true }
})
