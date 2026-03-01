import pg from 'pg'

const { Pool } = pg

let pool: pg.Pool | null = null

export const getPool = () => {
  const config = useRuntimeConfig()
  
  if (!pool) {
    pool = new Pool({
      host: config.dbHost,
      port: parseInt(config.dbPort as string) || 5432,
      database: config.dbName,
      user: config.dbUser,
      password: config.dbPassword,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  
  return pool
}

export const query = async (text: string, params?: any[]) => {
  const pool = getPool()
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount })
  return res
}

export const closePool = async () => {
  if (pool) {
    await pool.end()
    pool = null
  }
}
