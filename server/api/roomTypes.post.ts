import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const filePath = join(process.cwd(), 'server', 'data', 'roomTypes.json')
  
  const data = await readFile(filePath, 'utf-8')
  const types = JSON.parse(data)
  
  const newType = {
    id: body.id,
    nameRu: body.nameRu,
    nameEn: body.nameEn
  }
  
  types.push(newType)
  await writeFile(filePath, JSON.stringify(types, null, 2))
  
  return newType
})
