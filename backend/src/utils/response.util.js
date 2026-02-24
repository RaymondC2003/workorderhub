export function success(req, res, data, status = 200) {
  res.status(status).json({
    requestId: req.requestId,
    success: true,
    data
  });
}

export function error(req, res, err) {
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
