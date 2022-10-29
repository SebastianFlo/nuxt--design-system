/**
 * All the shared api models, like errors, form handling etc.
 * NOTE: Please keep this file very minimal, and don't dump specific endpoint models in here.
 */
export interface ApiErrorDetail {
  field: string;
  message: string;
  type: string;
  value?: string;
}

export interface ApiErrorData {
  code?: number;
  errors?: ApiErrorDetail[];
  message?: string;
  status: string;
}

// TODO: add this to the http plugin on both design system and website,
// using onError hook that awaits the error response and re-throws an ApiError.
export class ApiError extends Error implements ApiErrorData {
  readonly errors: ApiErrorDetail[];
  readonly message: string;
  readonly response?: any;
  readonly status: string;
  readonly code: number | undefined;

  constructor(data?: ApiErrorData) {
    super(data?.message ?? undefined);

    this.code = data?.code;
    this.errors = data?.errors ?? [];
    this.message = data?.message ?? '';
    this.status = data?.status ?? '';
    this.name = 'ApiError';
  }
}
