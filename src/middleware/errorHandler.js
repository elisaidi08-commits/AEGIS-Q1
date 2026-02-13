function errorHandler(err, req, res, _next) {
  console.error('Error:', err.message);

  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.statusCode ? err.message : 'An unexpected error occurred';

  res.status(statusCode).json({
    success: false,
    error: { code, message }
  });
}

module.exports = { errorHandler };
