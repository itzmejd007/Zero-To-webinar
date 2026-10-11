export default function errorHandler(error, _request, response, _next) {
  const isMulterError = error.name === 'MulterError';
  const statusCode =
    error.statusCode ||
    (isMulterError && error.code === 'LIMIT_FILE_SIZE' ? 413 : isMulterError ? 400 : 500);
  const message =
    isMulterError && error.code === 'LIMIT_FILE_SIZE'
      ? 'The resume PDF must be 10 MB or smaller.'
      : isMulterError
        ? 'The resume upload could not be processed.'
        : error.message || 'Something went wrong on the server.';

  if (statusCode >= 500) {
    console.error('Unhandled server error:', error);
  } else {
    console.warn('Request rejected:', message);
  }

  response.status(statusCode).json({
    success: false,
    message,
  });
}
