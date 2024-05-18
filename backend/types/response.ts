class HandleResponse extends Error {
  statusCode: number;

  constructor(message?: string, statusCode?: number) {
    super(message);
    this.message = message || 'Something went wrong on our end';
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default HandleResponse;
