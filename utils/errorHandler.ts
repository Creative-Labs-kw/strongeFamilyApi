import { ErrorRequestHandler } from "express";
import NotFoundError from "../utils/notFoundError";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err.stack);

  // Set the status code depending on the type of error
  let statusCode;
  if (err instanceof SyntaxError) {
    statusCode = 400; // Bad Request
  } else if (err instanceof NotFoundError) {
    statusCode = 404; // Not Found
  } else {
    statusCode = 500; // Internal Server Error
  }

  // Send the error message to the client
  res.status(statusCode).json({
    error: {
      message: err.message,
    },
  });
};

export default errorHandler;
