const service = require('../services/product.service');

const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getLowStock = async (req, res, next) => {
  try {
    const data = await service.getLowStock();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ message: 'Produk dihapus' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getLowStock,
  create,
  update,
  remove,
};
