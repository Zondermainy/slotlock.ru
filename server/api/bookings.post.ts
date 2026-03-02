import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const startTime = (body.startTime || '00:00').substring(0, 5)
  const endTime = (body.endTime || '00:00').substring(0, 5)
  const bookingDate = String(body.date).split('T')[0]
  
  // Check max duration (4 hours)
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  const durationHours = (endH * 60 + endM - (startH * 60 + startM)) / 60
  
  if (startH < 7 || startH >= 23) {
    throw createError({ statusCode: 400, message: 'Бронирование возможно с 7:00 до 23:00' })
  }
  
  if (endH > 23 || (endH === 23 && endM > 0)) {
    throw createError({ statusCode: 400, message: 'Бронирование возможно с 7:00 до 23:00' })
  }
  
  if (durationHours > 4) {
    throw createError({ statusCode: 400, message: 'Максимальная длительность брони - 4 часа' })
  }
  
  if (durationHours <= 0) {
    throw createError({ statusCode: 400, message: 'Время окончания должно быть позже времени начала' })
  }
  
  // Check max 2 active bookings per user
  const userBookingsCheck = await query(
    `SELECT COUNT(*) as count FROM bookings 
     WHERE user_id = $1 
     AND booking_date::date = $2
     AND status = 'confirmed'`,
    [body.userId, bookingDate]
  )
  
  if (parseInt(userBookingsCheck.rows[0].count) >= 2) {
    throw createError({ statusCode: 400, message: 'Максимум 2 брони в день на одного пользователя' })
  }
  
  const overlapCheck = await query(
    `SELECT id FROM bookings 
     WHERE room_id = $1 
     AND DATE(booking_date) = $2
     AND start_time < $3 
     AND end_time > $4`,
    [body.roomId, bookingDate, endTime, startTime]
  )
  
  if (overlapCheck.rows.length > 0) {
    throw createError({ statusCode: 409, message: 'Время уже занято' })
  }
  
  const id = `booking-${Date.now()}`
  
  const result = await query(
    `INSERT INTO bookings (id, room_id, user_id, user_name, title, booking_date, start_time, end_time, status) 
     VALUES ($1, $2, $3, $4, $5, $6::date, $7, $8, $9) RETURNING *`,
    [id, body.roomId, body.userId, body.userName, body.title || 'Без названия', bookingDate, startTime, endTime, 'confirmed']
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
