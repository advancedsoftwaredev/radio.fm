export class ApiError extends Error {
  constructor(message: string, readonly code: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class MethodNotAllowedError extends ApiError {
  constructor() {
    super('Method not allowed', 405);
  }
}

export class BadInputError extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}
