import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const overlapCheck = await query(
    `SELECT id FROM bookings 
     WHERE room_id = $1 
     AND booking_date = $2
     AND start_time < $3 
     AND end_time > $4`,
    [body.roomId, body.date, body.endTime, body.startTime]
  )
  
  if (overlapCheck.rows.length > 0) {
    throw createError({ statusCode: 409, message: 'Время уже занято' })
  }
  
  const id = `booking-${Date.now()}`
  
  const result = await query(
    `INSERT INTO bookings (id, room_id, user_id, user_name, title, booking_date, start_time, end_time, status) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [id, body.roomId, body.userId, body.userName, body.title || 'Без названия', body.date, body.startTime, body.endTime, 'confirmed']
  )
  
  const row = result.rows[0]
  return {
    id: row.id,
    roomId: row.room_id,
    userId: row.user_id,
    userName: row.user_name,
    title: row.title,
    date: row.booking_date,
    startTime: row.start_time,
    endTime: row.end_time,
    status: row.status
  }
})
