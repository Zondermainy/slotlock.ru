import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const startTime = (body.startTime || '00:00').substring(0, 5)
  const endTime = (body.endTime || '00:00').substring(0, 5)
  
  // Parse date as local date, not as UTC timestamp
  const dateParts = String(body.date).split('-')
  const bookingDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
  const bookingDateStr = bookingDate.toISOString().split('T')[0]
  
  const overlapCheck = await query(
    `SELECT id FROM bookings 
     WHERE room_id = $1 
     AND booking_date::date = $2
     AND start_time < $3 
     AND end_time > $4`,
    [body.roomId, bookingDateStr, endTime, startTime]
  )
  
  if (overlapCheck.rows.length > 0) {
    throw createError({ statusCode: 409, message: 'Время уже занято' })
  }
  
  const id = `booking-${Date.now()}`
  
  const result = await query(
    `INSERT INTO bookings (id, room_id, user_id, user_name, title, booking_date, start_time, end_time, status) 
     VALUES ($1, $2, $3, $4, $5, $6::date, $7, $8, $9) RETURNING *`,
    [id, body.roomId, body.userId, body.userName, body.title || 'Без названия', bookingDateStr, startTime, endTime, 'confirmed']
  )
  
  const row = result.rows[0]
  return {
    id: row.id,
    roomId: row.room_id,
    userId: row.user_id,
    userName: row.user_name,
    title: row.title,
    date: String(row.booking_date).split('T')[0],
    startTime: String(row.start_time).substring(0, 5),
    endTime: String(row.end_time).substring(0, 5),
    status: row.status
  }
})
