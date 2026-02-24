export function success(req, res, data, status = 200) {
  if (req.requestId) res.setHeader("X-Request-Id", req.requestId);
  res.status(status).json({
    requestId: req.requestId,
    success: true,
    data
  });
}

export function error(req, res, err) {
  if (req.requestId) res.setHeader("X-Request-Id", req.requestId);
  res.status(err.statusCode).json({
    requestId: req.requestId,
    success: false,
    error: {
      code: err.code,
      message: err.message,
      details: err.details || []
    }
  });
}
