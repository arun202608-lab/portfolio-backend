/**
 * Catch requests to nonexistent routes
 */
export function notFound(req, res, next) {
  const error = new Error(`Resource not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

/**
 * Centralized error handling middleware
 */
export function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = "Invalid ID format specified.";
  }

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  // Handle Duplicate Key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value entered for ${field}.`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}
