import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { ZodError } from "zod";

const errorHandler = (err, req, res, next) => {
  const expectedAuthCheck =
    err.statusCode === 401 &&
    req.method === "GET" &&
    req.path === "/api/v1/users/me";

  if (!expectedAuthCheck) {
    console.error("Error:", {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid ID format";
    errors = [{ field: err.path, message: "Invalid ID format" }];
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    errors = [{ field, message: `${field} already exists` }];
  }

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File too large";
    errors = [{ field: "file", message: "File size exceeds 5MB limit" }];
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400;
    message = "Unexpected file field";
    errors = [{ field: "file", message: "Unexpected file field" }];
  }

  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, { errors }, message));
};

export { errorHandler };
