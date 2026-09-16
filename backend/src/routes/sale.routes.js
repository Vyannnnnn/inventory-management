const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/sale.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/rbac.middleware');
const validateRequest = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  allowRoles('owner', 'admin', 'kasir'),
  [
    body('items').isArray({ min: 1 }).withMessage('Item transaksi wajib diisi'),
    body('paymentMethod').isIn(['cash', 'qris', 'transfer']).withMessage('Metode bayar tidak valid'),
    validateRequest,
  ],
  controller.create
);

router.get('/', controller.getAll);
router.get('/export/csv', controller.exportCsv);
router.get('/:id', controller.getById);

module.exports = router;
