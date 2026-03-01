import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const result = await query(
    'INSERT INTO room_types (id, name_ru, name_en) VALUES ($1, $2, $3) RETURNING *',
    [body.id, body.nameRu, body.nameEn]
  )
  
  return {
    id: result.rows[0].id,
    nameRu: result.rows[0].name_ru,
    nameEn: result.rows[0].name_en
  }
})
