// server/src/middleware/validate.middleware.js

import { ApiError } from "../utils/ApiError.js";

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const errors = error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    next(new ApiError(400, "Validation error", errors));
  }
};

export { validate };