import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  const filePath = join(process.cwd(), 'server', 'data', 'rooms.json')
  const data = await readFile(filePath, 'utf-8')
  return JSON.parse(data)
})
