export interface Error {
  type:
    | 'api_connection_error'
    | 'api_error'
    | 'authentication_error'
    | 'card_error'
    | 'invalid_request_error'
    | 'rate_limit_error';
  charge: string;
  message?: string;
  code?: string;
  decline_code: string;
  param?: string;
}

export interface Address {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
}
