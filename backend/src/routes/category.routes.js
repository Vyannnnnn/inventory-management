const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/rbac.middleware');
const validateRequest = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', controller.getAll);
router.post(
  '/',
  allowRoles('owner', 'admin'),
  [
    body('name').notEmpty().withMessage('Nama kategori wajib diisi'),
    validateRequest,
  ],
  controller.create
);
router.put(
  '/:id',
  allowRoles('owner', 'admin'),
  [
    body('name').notEmpty().withMessage('Nama kategori wajib diisi'),
    validateRequest,
  ],
  controller.update
);
router.delete('/:id', allowRoles('owner'), controller.remove);

module.exports = router;
