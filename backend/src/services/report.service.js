const pool = require('../config/db');

const salesReport = async ({ period = 'day' }) => {
  const format = period === 'year' ? '%Y' : period === 'month' ? '%Y-%m' : '%Y-%m-%d';
  const [rows] = await pool.execute(
    `SELECT DATE_FORMAT(created_at, ?) AS periodLabel, COUNT(*) AS totalTransactions, COALESCE(SUM(total), 0) AS totalSales
     FROM sales
     GROUP BY DATE_FORMAT(created_at, ?)
     ORDER BY periodLabel DESC`,
    [format, format]
  );
  return rows;
};

const topProducts = async () => {
  const [rows] = await pool.execute(
    `SELECT p.id, p.name,
            COALESCE(SUM(si.quantity), 0) AS totalSold,
            COALESCE(SUM(si.total), 0) AS totalRevenue
     FROM sale_items si
     INNER JOIN products p ON p.id = si.product_id
     GROUP BY p.id, p.name
     ORDER BY totalSold DESC
     LIMIT 20`
  );
  return rows;
};

const grossProfit = async ({ period = 'month' }) => {
  const format = period === 'year' ? '%Y' : period === 'day' ? '%Y-%m-%d' : '%Y-%m';
  const [rows] = await pool.execute(
    `SELECT DATE_FORMAT(s.created_at, ?) AS periodLabel,
            COALESCE(SUM(si.total), 0) AS grossRevenue,
            COALESCE(SUM(si.quantity * p.buy_price), 0) AS totalCost,
            COALESCE(SUM(si.total - (si.quantity * p.buy_price)), 0) AS grossProfit
     FROM sale_items si
     INNER JOIN sales s ON s.id = si.sale_id
     INNER JOIN products p ON p.id = si.product_id
     GROUP BY DATE_FORMAT(s.created_at, ?)
     ORDER BY periodLabel DESC`,
    [format, format]
  );
  return rows;
};

module.exports = {
  salesReport,
  topProducts,
  grossProfit,
};
