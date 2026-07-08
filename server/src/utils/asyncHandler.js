// server/src/utils/asyncHandler.js

/**
 * Wraps async controller functions to handle errors
 * Eliminates need for try-catch in controllers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export { asyncHandler };