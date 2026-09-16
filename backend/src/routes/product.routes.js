const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/rbac.middleware');
const validateRequest = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', controller.getAll);
router.get('/low-stock', controller.getLowStock);
router.post(
  '/',
  allowRoles('owner', 'admin', 'staff_gudang'),
  [
    body('name').notEmpty().withMessage('Nama produk wajib diisi'),
    body('sellPrice').isFloat({ min: 0 }).withMessage('Harga jual harus angka >= 0'),
    body('buyPrice').isFloat({ min: 0 }).withMessage('Harga beli harus angka >= 0'),
    body('stock').isInt({ min: 0 }).withMessage('Stok harus bilangan >= 0'),
    validateRequest,
  ],
  controller.create
);
router.put(
  '/:id',
  allowRoles('owner', 'admin', 'staff_gudang'),
  [
    body('name').notEmpty().withMessage('Nama produk wajib diisi'),
    body('sellPrice').isFloat({ min: 0 }).withMessage('Harga jual harus angka >= 0'),
    body('buyPrice').isFloat({ min: 0 }).withMessage('Harga beli harus angka >= 0'),
    body('stock').isInt({ min: 0 }).withMessage('Stok harus bilangan >= 0'),
    validateRequest,
  ],
  controller.update
);
router.delete('/:id', allowRoles('owner', 'admin'), controller.remove);

module.exports = router;
