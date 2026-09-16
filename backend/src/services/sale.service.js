const pool = require('../config/db');
const { getPagination } = require('../utils/pagination');

const createSale = async ({ items, discount = 0, paymentMethod, paidAmount = 0, userId }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let subtotal = 0;
    const normalizedItems = [];

    for (const item of items) {
      const [productRows] = await conn.execute(
        'SELECT id, name, stock, sell_price FROM products WHERE id = ? FOR UPDATE',
        [item.productId]
      );
      if (!productRows.length) {
        const error = new Error(`Produk dengan id ${item.productId} tidak ditemukan`);
        error.statusCode = 404;
        throw error;
      }

      const product = productRows[0];
      if (product.stock < item.quantity) {
        const error = new Error(`Stok produk ${product.name} tidak mencukupi`);
        error.statusCode = 400;
        throw error;
      }

      const lineTotal = Number(product.sell_price) * Number(item.quantity);
      subtotal += lineTotal;
      normalizedItems.push({
        productId: product.id,
        quantity: Number(item.quantity),
        price: Number(product.sell_price),
        lineTotal,
      });

      await conn.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.productId]);
    }

    const total = Math.max(subtotal - Number(discount), 0);
    const safePaidAmount = Number(paidAmount);
    const changeAmount = Math.max(safePaidAmount - total, 0);
    const invoiceNo = `INV-${Date.now()}`;

    const [saleResult] = await conn.execute(
      `INSERT INTO sales (invoice_no, user_id, subtotal, discount, total, payment_method, paid_amount, change_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [invoiceNo, userId, subtotal, discount, total, paymentMethod, safePaidAmount, changeAmount]
    );

    for (const item of normalizedItems) {
      await conn.execute(
        'INSERT INTO sale_items (sale_id, product_id, quantity, price, total) VALUES (?, ?, ?, ?, ?)',
        [saleResult.insertId, item.productId, item.quantity, item.price, item.lineTotal]
      );
    }

    await conn.commit();

    return {
      id: saleResult.insertId,
      invoiceNo,
      subtotal,
      discount: Number(discount),
      total,
      paymentMethod,
      paidAmount: safePaidAmount,
      changeAmount,
      items: normalizedItems,
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const getAllSales = async (query) => {
  const { page, pageSize, offset } = getPagination(query);
  const from = query.from || '1970-01-01';
  const to = query.to || '2999-12-31';

  const [rows] = await pool.execute(
    `SELECT s.id, s.invoice_no AS invoiceNo, s.subtotal, s.discount, s.total, s.payment_method AS paymentMethod,
            s.paid_amount AS paidAmount, s.change_amount AS changeAmount, s.created_at AS createdAt,
            u.full_name AS cashierName
     FROM sales s
     LEFT JOIN users u ON u.id = s.user_id
     WHERE DATE(s.created_at) BETWEEN ? AND ?
     ORDER BY s.id DESC
     LIMIT ? OFFSET ?`,
    [from, to, pageSize, offset]
  );

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM sales s
     WHERE DATE(s.created_at) BETWEEN ? AND ?`,
    [from, to]
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

const getSaleById = async (id) => {
  const [saleRows] = await pool.execute(
    `SELECT id, invoice_no AS invoiceNo, subtotal, discount, total, payment_method AS paymentMethod,
            paid_amount AS paidAmount, change_amount AS changeAmount, created_at AS createdAt
     FROM sales
     WHERE id = ?`,
    [id]
  );

  if (!saleRows.length) {
    const error = new Error('Transaksi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const [itemRows] = await pool.execute(
    `SELECT si.product_id AS productId, p.name AS productName, si.quantity, si.price, si.total
     FROM sale_items si
     INNER JOIN products p ON p.id = si.product_id
     WHERE si.sale_id = ?`,
    [id]
  );

  return {
    ...saleRows[0],
    items: itemRows,
  };
};

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
};
