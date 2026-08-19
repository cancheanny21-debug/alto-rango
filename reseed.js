import fs from 'fs'
import pool from './server/db.js'

async function run() {
  try {
    const schema = fs.readFileSync('scripts/db/01_schema.sql', 'utf8')
    const data = fs.readFileSync('scripts/db/02_sample_data.sql', 'utf8')
    
    await pool.execute('SET FOREIGN_KEY_CHECKS = 0')
    const [tables] = await pool.execute('SHOW TABLES')
    for (const row of tables) {
      const tableName = Object.values(row)[0]
      await pool.execute(`DROP TABLE IF EXISTS ${tableName}`)
    }
    await pool.execute('SET FOREIGN_KEY_CHECKS = 1')

    // Split by semicolons
    const queries = [
      ...schema.split(';').filter(q => q.trim()),
      ...data.split(';').filter(q => q.trim())
    ]
    
    for (const query of queries) {
      if (query.trim()) {
        await pool.execute(query)
      }
    }
    console.log('Base de datos inicializada correctamente')
  } catch (err) {
    console.error(err)
  } finally {
    process.exit()
  }
}
run()
