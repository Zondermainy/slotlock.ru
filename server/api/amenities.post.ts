import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const filePath = join(process.cwd(), 'server', 'data', 'amenities.json')
  
  const data = await readFile(filePath, 'utf-8')
  const amenities = JSON.parse(data)
  
  const newAmenity = {
    id: body.id,
    nameRu: body.nameRu,
    nameEn: body.nameEn
  }
  
  amenities.push(newAmenity)
  await writeFile(filePath, JSON.stringify(amenities, null, 2))
  
  return newAmenity
})
