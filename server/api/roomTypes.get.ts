import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const result = await query('SELECT * FROM room_types ORDER BY id')
  return result.rows.map(row => ({
    id: row.id,
    nameRu: row.name_ru,
    nameEn: row.name_en
  }))
})
