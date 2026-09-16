const pool = require('../config/db');
const { comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

const login = async ({ username, password }) => {
  const [rows] = await pool.execute(
    'SELECT id, full_name, username, password_hash, role FROM users WHERE username = ? LIMIT 1',
    [username]
  );

  if (!rows.length) {
    const error = new Error('Username atau password salah');
    error.statusCode = 401;
    throw error;
  }

  const user = rows[0];
  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Username atau password salah');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({
    id: user.id,
    name: user.full_name,
    username: user.username,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.full_name,
      username: user.username,
      role: user.role,
    },
  };
};

module.exports = { login };
