import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  const filePath = join(process.cwd(), 'server', 'data', 'roomTypes.json')
  const data = await readFile(filePath, 'utf-8')
  return JSON.parse(data)
})
