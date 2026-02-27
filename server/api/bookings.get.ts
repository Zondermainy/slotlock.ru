import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filePath = join(process.cwd(), 'server', 'data', 'bookings.json')
  const data = await readFile(filePath, 'utf-8')
  let bookings = JSON.parse(data)
  
  if (query.roomId) {
    bookings = bookings.filter((b: any) => b.roomId === query.roomId)
  }
  
  if (query.date) {
    bookings = bookings.filter((b: any) => b.date === query.date)
  }
  
  return bookings
})
