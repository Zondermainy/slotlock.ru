import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const urlQuery = getQuery(event)
  
  // Auto-delete old bookings from database
  const now = new Date()
  const localDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
  const currentHour = now.getHours().toString().padStart(2, '0')
  
  await query(
    `DELETE FROM bookings 
     WHERE booking_date < $1 
     OR (booking_date = $1 AND end_time <= $2)`,
    [localDate, currentHour]
  )
  
  let sql = 'SELECT * FROM bookings'
  const params: any[] = []
  const conditions: string[] = []
  
  if (urlQuery.roomId) {
    conditions.push(`room_id = $${params.length + 1}`)
    params.push(urlQuery.roomId)
  }
  
  if (urlQuery.date) {
    conditions.push(`booking_date = $${params.length + 1}`)
    params.push(urlQuery.date)
  }
  
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ')
  }
  
  sql += ' ORDER BY booking_date, start_time'
  
  const result = await query(sql, params)
  
  return result.rows.map(row => ({
    id: row.id,
    roomId: row.room_id,
    userId: row.user_id,
    userName: row.user_name,
    title: row.title,
    date: row.booking_date,
    startTime: row.start_time,
    endTime: row.end_time,
    status: row.status
  }))
})
