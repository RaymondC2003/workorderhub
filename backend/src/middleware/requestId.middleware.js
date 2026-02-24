import { randomUUID } from "crypto";

export default (req, res, next) => {
  req.requestId = randomUUID();
  next();
};
