const service = require("../services/workorders.service");
const { success } = require("../utils/response.util");

exports.create = (req, res, next) => {
  try {
    const item = service.create(req.body);
    success(req, res, item, 201);
  } catch (err) {
    next(err);
  }
};

exports.list = (req, res, next) => {
  try {
    const result = service.list(req.query);
    success(req, res, result);
  } catch (err) {
    next(err);
  }
};

exports.getById = (req, res, next) => {
  try {
    const item = service.getById(req.params.id);
    success(req, res, item);
  } catch (err) {
    next(err);
  }
};

exports.changeStatus = (req, res, next) => {
  try {
    const item = service.changeStatus(req.params.id, req.body.status);
    success(req, res, item);
  } catch (err) {
    next(err);
  }
};