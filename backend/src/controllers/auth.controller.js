const authService = require('../services/auth.service');

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.json({ message: 'Logout berhasil' });
};

const me = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = {
  login,
  logout,
  me,
};
