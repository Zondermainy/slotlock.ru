import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const filePath = join(process.cwd(), 'server', 'data', 'bookings.json')
  
  const data = await readFile(filePath, 'utf-8')
  const bookings = JSON.parse(data)
  
  const isOverlap = bookings.some((b: any) => 
    b.roomId === body.roomId && 
    b.date === body.date &&
    b.startTime < body.endTime && 
    b.endTime > body.startTime
  )
  
  if (isOverlap) {
    throw createError({ statusCode: 409, message: 'Время уже занято' })
  }
  
  const newBooking = {
    id: `booking-${Date.now()}`,
    ...body,
    status: 'confirmed'
  }
  
  bookings.push(newBooking)
  await writeFile(filePath, JSON.stringify(bookings, null, 2))
  
  return newBooking
})
