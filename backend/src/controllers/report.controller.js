const reportService = require('../services/report.service');
const { toCsv } = require('../utils/csv');

const salesReport = async (req, res, next) => {
  try {
    const data = await reportService.salesReport(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const topProducts = async (req, res, next) => {
  try {
    const data = await reportService.topProducts();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const grossProfit = async (req, res, next) => {
  try {
    const data = await reportService.grossProfit(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const exportSalesCsv = async (req, res, next) => {
  try {
    const data = await reportService.salesReport(req.query);
    const csv = toCsv(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=laporan-penjualan-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  salesReport,
  topProducts,
  grossProfit,
  exportSalesCsv,
};
