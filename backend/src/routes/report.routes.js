const express = require('express');
const controller = require('../controllers/report.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/rbac.middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(allowRoles('owner', 'admin'));

router.get('/sales', controller.salesReport);
router.get('/top-products', controller.topProducts);
router.get('/gross-profit', controller.grossProfit);
router.get('/sales/export/csv', controller.exportSalesCsv);

module.exports = router;
