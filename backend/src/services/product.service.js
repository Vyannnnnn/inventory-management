const pool = require('../config/db');
const { getPagination } = require('../utils/pagination');

const getAll = async (query) => {
  const { page, pageSize, offset } = getPagination(query);
  const search = query.search ? `%${query.search}%` : '%';
  const categoryId = query.categoryId || null;

  const whereSql = categoryId ? 'WHERE p.name LIKE ? AND p.category_id = ?' : 'WHERE p.name LIKE ?';
  const params = categoryId ? [search, categoryId] : [search];

  const [rows] = await pool.execute(
    `SELECT p.id, p.name, p.buy_price AS buyPrice, p.sell_price AS sellPrice, p.stock, p.min_stock AS minStock,
            c.id AS categoryId, c.name AS categoryName,
            s.id AS supplierId, s.name AS supplierName
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     LEFT JOIN suppliers s ON s.id = p.supplier_id
     ${whereSql}
     ORDER BY p.id DESC
     LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM products p ${whereSql}`,
    params
  );

  return {
    data: rows,
    pagination: {
      page,
      pageSize,
      total: countRows[0].total,
    },
  };
};

const getLowStock = async () => {
  const [rows] = await pool.execute(
    `SELECT id, name, stock, min_stock AS minStock
     FROM products
     WHERE stock <= min_stock
     ORDER BY stock ASC`
  );
  return rows;
};

const create = async (payload) => {
  const [result] = await pool.execute(
    `INSERT INTO products
      (name, category_id, supplier_id, buy_price, sell_price, stock, min_stock)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.name,
      payload.categoryId || null,
      payload.supplierId || null,
      payload.buyPrice,
      payload.sellPrice,
      payload.stock,
      payload.minStock || 0,
    ]
  );

  return { id: result.insertId, ...payload };
};

const update = async (id, payload) => {
  await pool.execute(
    `UPDATE products
     SET name = ?, category_id = ?, supplier_id = ?, buy_price = ?, sell_price = ?, stock = ?, min_stock = ?
     WHERE id = ?`,
    [
      payload.name,
      payload.categoryId || null,
      payload.supplierId || null,
      payload.buyPrice,
      payload.sellPrice,
      payload.stock,
      payload.minStock || 0,
      id,
    ]
  );

  return { id: Number(id), ...payload };
};

const remove = async (id) => {
  await pool.execute('DELETE FROM products WHERE id = ?', [id]);
};

module.exports = {
  getAll,
  getLowStock,
  create,
  update,
  remove,
};
