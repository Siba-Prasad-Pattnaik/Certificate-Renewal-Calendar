import { z } from 'zod';
import { ApiResponse as ApiResponseType } from '../zod/types';

// Zod schemas for API responses
export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.any().optional(),
  meta: z.object({
    timestamp: z.string().datetime(),
    requestId: z.string().optional(),
    page: z.number().int().positive().optional(),
    perPage: z.number().int().positive().optional(),
    total: z.number().int().nonnegative().optional(),
    totalPages: z.number().int().positive().optional(),
  }).optional(),
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
  meta: z.object({
    timestamp: z.string().datetime(),
    requestId: z.string().optional(),
    path: z.string().optional(),
    method: z.string().optional(),
  }).optional(),
});

export const ApiResponseSchema = z.discriminatedUnion('success', [
  SuccessResponseSchema,
  ErrorResponseSchema,
]);

// HTTP status codes with their default error messages
export const HttpStatus = {
  // Success
  200: 'OK',
  201: 'Created',
  204: 'No Content',

  // Client errors
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',

  // Server errors
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
} as const;

// Standard error codes mapped to HTTP statuses
export const ErrorCodes = {
  // Validation errors
  VALIDATION_ERROR: { status: 400, code: 'VALIDATION_ERROR' },
  REQUIRED_FIELD: { status: 400, code: 'REQUIRED_FIELD' },
  INVALID_FORMAT: { status: 400, code: 'INVALID_FORMAT' },

  // Authentication/Authorization errors
  UNAUTHORIZED: { status: 401, code: 'UNAUTHORIZED' },
  FORBIDDEN: { status: 403, code: 'FORBIDDEN' },
  INVALID_TOKEN: { status: 401, code: 'INVALID_TOKEN' },
  TOKEN_EXPIRED: { status: 401, code: 'TOKEN_EXPIRED' },

  // Resource errors
  NOT_FOUND: { status: 404, code: 'NOT_FOUND' },
  ALREADY_EXISTS: { status: 409, code: 'ALREADY_EXISTS' },
  CONFLICT: { status: 409, code: 'CONFLICT' },

  // Rate limiting
  TOO_MANY_REQUESTS: { status: 429, code: 'TOO_MANY_REQUESTS' },

  // Server errors
  INTERNAL_ERROR: { status: 500, code: 'INTERNAL_ERROR' },
  SERVICE_UNAVAILABLE: { status: 503, code: 'SERVICE_UNAVAILABLE' },
} as const;

// API response builder class
export class ApiResponse {
  static success<T>(data?: T, meta?: ApiResponseType<T>['meta']): ApiResponseType<T> {
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }

  static error(
    code: keyof typeof ErrorCodes,
    message?: string,
    details?: unknown,
    meta?: Record<string, unknown>
  ): ApiResponseType<never> {
    const errorConfig = ErrorCodes[code];
    const defaultMessage = HttpStatus[errorConfig.status as keyof typeof HttpStatus] || 'Unknown error';

    return {
      success: false,
      error: {
        code: errorConfig.code,
        message: message || defaultMessage,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }

  static validationError(errors: z.ZodError['errors'], message = 'Validation failed'): ApiResponseType<never> {
    return this.error('VALIDATION_ERROR', message, { errors });
  }

  static notFound(resource: string): ApiResponseType<never> {
    return this.error('NOT_FOUND', `${resource} not found`);
  }

  static unauthorized(message = 'Authentication required'): ApiResponseType<never> {
    return this.error('UNAUTHORIZED', message);
  }

  static forbidden(message = 'Access denied'): ApiResponseType<never> {
    return this.error('FORBIDDEN', message);
  }

  static conflict(message = 'Resource already exists'): ApiResponseType<never> {
    return this.error('CONFLICT', message);
  }

  static internalError(message = 'Internal server error'): ApiResponseType<never> {
    return this.error('INTERNAL_ERROR', message);
  }

  static tooManyRequests(message = 'Too many requests'): ApiResponseType<never> {
    return this.error('TOO_MANY_REQUESTS', message);
  }

  // Helper to create paginated responses
  static paginated<T>(
    data: T[],
    pagination: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
    }
  ): ApiResponseType<T[]> {
    return this.success(data, {
      page: pagination.page,
      perPage: pagination.perPage,
      total: pagination.total,
      totalPages: pagination.totalPages,
      hasNext: pagination.page < pagination.totalPages,
      hasPrev: pagination.page > 1,
    });
  }

  // Helper to validate and parse data with Zod schema
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: ApiResponseType<never> } {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { 
        success: false, 
        error: this.validationError(result.error.errors) 
      };
    }
  }

  // Helper to handle try-catch blocks in API routes
  static async handle<T>(
    handler: () => Promise<T>,
    options?: {
      successMeta?: Record<string, unknown>;
      errorMeta?: Record<string, unknown>;
    }
  ): Promise<ApiResponseType<T>> {
    try {
      const data = await handler();
      return this.success(data, options?.successMeta);
    } catch (error) {
      console.error('API handler error:', error);
      
      if (error instanceof z.ZodError) {
        return this.validationError(error.errors);
      }
      
      if (error instanceof Error && 'code' in error && typeof error.code === 'string') {
        const errorCode = error.code as keyof typeof ErrorCodes;
        if (errorCode in ErrorCodes) {
          return this.error(errorCode, error.message, undefined, options?.errorMeta);
        }
      }
      
      return this.internalError(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

// Export types
export type SuccessResponse<T> = z.infer<typeof SuccessResponseSchema> & { data?: T };
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type ApiResponseZod = z.infer<typeof ApiResponseSchema>;

// Default export
export default ApiResponse;