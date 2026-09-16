const dashboardService = require('../services/dashboard.service');

const summary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  summary,
};
