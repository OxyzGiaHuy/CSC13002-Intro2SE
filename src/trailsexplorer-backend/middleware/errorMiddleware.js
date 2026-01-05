const errorHandler = (err, req, res, next) => {
  // Nếu status code chưa được set, mặc định là 500 (Internal Server Error)
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    // Chỉ hiện stack trace khi ở môi trường development để debug
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};