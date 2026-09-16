const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.execute('SELECT id, name, description FROM categories ORDER BY name ASC');
  return rows;
};

const create = async ({ name, description }) => {
  const [result] = await pool.execute('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description || null]);
  return { id: result.insertId, name, description: description || null };
};

const update = async (id, payload) => {
  await pool.execute('UPDATE categories SET name = ?, description = ? WHERE id = ?', [payload.name, payload.description || null, id]);
  return { id: Number(id), ...payload };
};

const remove = async (id) => {
  await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
