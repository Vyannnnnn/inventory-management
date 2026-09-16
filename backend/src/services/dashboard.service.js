const pool = require('../config/db');

const getSummary = async () => {
  const [[today]] = await pool.execute(
    `SELECT COALESCE(SUM(total), 0) AS totalToday
     FROM sales
     WHERE DATE(created_at) = CURDATE()`
  );

  const [[month]] = await pool.execute(
    `SELECT COALESCE(SUM(total), 0) AS totalMonth
     FROM sales
     WHERE YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())`
  );

  const [lowStock] = await pool.execute(
    `SELECT id, name, stock, min_stock AS minStock
     FROM products
     WHERE stock <= min_stock
     ORDER BY stock ASC
     LIMIT 10`
  );

  const [dailyChart] = await pool.execute(
    `SELECT DATE(created_at) AS label, COALESCE(SUM(total), 0) AS value
     FROM sales
     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
     GROUP BY DATE(created_at)
     ORDER BY DATE(created_at) ASC`
  );

  const [monthlyChart] = await pool.execute(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') AS label, COALESCE(SUM(total), 0) AS value
     FROM sales
     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
     GROUP BY DATE_FORMAT(created_at, '%Y-%m')
     ORDER BY DATE_FORMAT(created_at, '%Y-%m') ASC`
  );

  return {
    totalToday: Number(today.totalToday),
    totalMonth: Number(month.totalMonth),
    lowStock,
    chart: {
      daily: dailyChart,
      monthly: monthlyChart,
    },
  };
};

module.exports = {
  getSummary,
};
