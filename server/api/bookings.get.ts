import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filePath = join(process.cwd(), 'server', 'data', 'bookings.json')
  const data = await readFile(filePath, 'utf-8')
  let bookings = JSON.parse(data)
  
  // Auto-delete old bookings (only for GET requests that ask for all bookings)
  if (!query.roomId && !query.date) {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const currentHour = now.getHours().toString().padStart(2, '0')
    
    const initialLength = bookings.length
    bookings = bookings.filter((b: any) => {
      // Keep if: date is today and endTime > currentHour, OR date is in the future
      if (b.date > today) return true
      if (b.date === today && b.endTime > currentHour) return true
      return false
    })
    
    // Only write if we actually removed some bookings
    if (bookings.length !== initialLength) {
      await writeFile(filePath, JSON.stringify(bookings, null, 2))
    }
  }
  
  if (query.roomId) {
    bookings = bookings.filter((b: any) => b.roomId === query.roomId)
  }
  
  if (query.date) {
    bookings = bookings.filter((b: any) => b.date === query.date)
  }
  
  return bookings
})
