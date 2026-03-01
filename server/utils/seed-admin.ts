// Seed script to create admin user
// Run with: npx tsx server/utils/seed-admin.ts

import pg from 'pg'
import bcrypt from 'bcryptjs'

const { Pool } = pg

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'slotlock',
  user: process.env.DB_USER || 'slotlock',
  password: process.env.DB_PASSWORD || ''
})

async function seed() {
  const password = 'slotlock_admin'
  const hashedPassword = await bcrypt.hash(password, 10)
  
  // Check if admin exists
  const existing = await pool.query(
    "SELECT id FROM users WHERE email = 'slotlock_admin@dvfu.ru'"
  )
  
  if (existing.rows.length > 0) {
    // Update existing user to admin
    await pool.query(
      "UPDATE users SET password = $1, role = 'admin', name = 'slotlock_admin' WHERE email = 'slotlock_admin@dvfu.ru'",
      [hashedPassword]
    )
    console.log('Admin user updated!')
  } else {
    // Insert new admin
    await pool.query(
      "INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)",
      ['slotlock_admin@dvfu.ru', hashedPassword, 'slotlock_admin', 'admin']
    )
    console.log('Admin user created!')
  }
  
  await pool.end()
}

seed().catch(console.error)
