import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const filePath = join(process.cwd(), 'server', 'data', 'bookings.json')
  
  const data = await readFile(filePath, 'utf-8')
  let bookings = JSON.parse(data)
  
  const index = bookings.findIndex((b: any) => b.id === id)
  
  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Бронь не найдена' })
  }
  
  bookings.splice(index, 1)
  await writeFile(filePath, JSON.stringify(bookings, null, 2))
  
  return { success: true }
})
