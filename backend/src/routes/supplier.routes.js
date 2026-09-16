const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/supplier.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/rbac.middleware');
const validateRequest = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', controller.getAll);
router.get('/:id/purchases', controller.getPurchaseHistory);
router.post(
  '/',
  allowRoles('owner', 'admin', 'staff_gudang'),
  [
    body('name').notEmpty().withMessage('Nama supplier wajib diisi'),
    validateRequest,
  ],
  controller.create
);
router.put(
  '/:id',
  allowRoles('owner', 'admin', 'staff_gudang'),
  [
    body('name').notEmpty().withMessage('Nama supplier wajib diisi'),
    validateRequest,
  ],
  controller.update
);
router.delete('/:id', allowRoles('owner', 'admin'), controller.remove);

module.exports = router;
