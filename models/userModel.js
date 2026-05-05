const pool = require('../db/pool');

async function getUserById(googleId) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE google_id = $1',
    [googleId]
  );
  return rows[0] || null;
}

async function createNewUser(values) {
  const { rows } = await pool.query(
    `INSERT INTO users (google_id, display_name, first_name, last_name, email)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    values
  );
  return rows[0];
}

module.exports = { getUserById, createNewUser };
