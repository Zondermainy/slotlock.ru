import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  const result = await query('DELETE FROM bookings WHERE id = $1 RETURNING id', [id])
  
  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Бронь не найдена' })
  }
  
  return { success: true }
})
