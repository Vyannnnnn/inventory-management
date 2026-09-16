const saleService = require('../services/sale.service');
const { toCsv } = require('../utils/csv');

const create = async (req, res, next) => {
  try {
    const sale = await saleService.createSale({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      ...sale,
      printableReceipt: {
        invoiceNo: sale.invoiceNo,
        items: sale.items,
        subtotal: sale.subtotal,
        discount: sale.discount,
        total: sale.total,
        paymentMethod: sale.paymentMethod,
        paidAmount: sale.paidAmount,
        changeAmount: sale.changeAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const data = await saleService.getAllSales(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await saleService.getSaleById(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const exportCsv = async (req, res, next) => {
  try {
    const data = await saleService.getAllSales({ ...req.query, page: 1, pageSize: 10000 });
    const csv = toCsv(data.data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=riwayat-transaksi-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  exportCsv,
};
