import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const urlQuery = getQuery(event)
  
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const today = `${year}-${month}-${day}`
  const currentHour = now.getHours().toString().padStart(2, '0')
  
  await query(
    `DELETE FROM bookings 
     WHERE booking_date::date < $1 
     OR (booking_date::date = $1 AND end_time <= $2)`,
    [today, currentHour]
  )
  
  let sql = 'SELECT * FROM bookings'
  const params: any[] = []
  const conditions: string[] = []
  
  if (urlQuery.roomId) {
    conditions.push(`room_id = $${params.length + 1}`)
    params.push(urlQuery.roomId)
  }
  
  if (urlQuery.date) {
    const dateParam = String(urlQuery.date).split('T')[0]
    conditions.push(`booking_date::date = $${params.length + 1}`)
    params.push(dateParam)
  }
  
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ')
  }
  
  sql += ' ORDER BY booking_date, start_time'
  
  const result = await query(sql, params)
  
  return result.rows.map(row => {
    const bookingDate = row.booking_date
    const dateStr = bookingDate instanceof Date 
      ? bookingDate.toISOString().split('T')[0]
      : String(bookingDate).split('T')[0]
    
    return {
      id: row.id,
      roomId: row.room_id,
      userId: row.user_id,
      userName: row.user_name,
      title: row.title,
      date: dateStr,
      startTime: String(row.start_time).substring(0, 5),
      endTime: String(row.end_time).substring(0, 5),
      status: row.status
    }
  })
})
