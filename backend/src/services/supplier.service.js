const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.execute('SELECT id, name, phone, email, address FROM suppliers ORDER BY name ASC');
  return rows;
};

const create = async (payload) => {
  const { name, phone, email, address } = payload;
  const [result] = await pool.execute(
    'INSERT INTO suppliers (name, phone, email, address) VALUES (?, ?, ?, ?)',
    [name, phone || null, email || null, address || null]
  );
  return { id: result.insertId, ...payload };
};

const update = async (id, payload) => {
  const { name, phone, email, address } = payload;
  await pool.execute('UPDATE suppliers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?', [name, phone || null, email || null, address || null, id]);
  return { id: Number(id), ...payload };
};

const remove = async (id) => {
  await pool.execute('DELETE FROM suppliers WHERE id = ?', [id]);
};

const getPurchaseHistory = async (supplierId) => {
  const [rows] = await pool.execute(
    `SELECT sp.id, sp.purchased_at, p.name AS product_name, sp.quantity, sp.unit_cost, sp.total_cost
     FROM supplier_purchases sp
     INNER JOIN products p ON p.id = sp.product_id
     WHERE sp.supplier_id = ?
     ORDER BY sp.purchased_at DESC`,
    [supplierId]
  );
  return rows;
};

module.exports = {
  getAll,
  create,
  update,
  remove,
  getPurchaseHistory,
};
