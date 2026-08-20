import pool from './server/db.js'

async function checkColumns() {
  try {
    const [rows] = await pool.execute("DESCRIBE memberships")
    console.log(rows)
  } catch (err) {
    console.error(err)
  } finally {
    process.exit(0)
  }
}
checkColumns()
