import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  const result = await query('DELETE FROM room_types WHERE id = $1 RETURNING id', [id])
  
  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Тип комнаты не найден' })
  }
  
  return { success: true }
})
