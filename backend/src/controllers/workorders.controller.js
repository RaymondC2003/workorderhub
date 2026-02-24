import * as service from "../services/workorders.service.js";
import { success } from "../utils/response.util.js";

export function create(req, res, next) {
  try {
    const item = service.create(req.body);
    success(req, res, item, 201);
  } catch (err) {
    next(err);
  }
}

export function list(req, res, next) {
  try {
    const result = service.list(req.query);
    success(req, res, result);
  } catch (err) {
    next(err);
  }
}

export function getById(req, res, next) {
  try {
    const item = service.getById(req.params.id);
    success(req, res, item);
  } catch (err) {
    next(err);
  }
}

export function changeStatus(req, res, next) {
  try {
    const item = service.changeStatus(req.params.id, req.body.status);
    success(req, res, item);
  } catch (err) {
    next(err);
  }
}
