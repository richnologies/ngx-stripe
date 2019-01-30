export interface PaymentRequestOptions {
  country: string;
  currency: string;
  total: {
    amount: number;
    label: string;
    pending?: boolean;
  };
  displayItems?: {
    amount: number;
    label: number;
    pending?: boolean;
  };
  requestPayerName?: boolean;
  requestPayerEmail?: boolean;
  requestPayerPhone?: boolean;
  requestShipping?: boolean;
  shippingOptions?: ShippingOptions[];
}

export interface ShippingOptions {
  id?: string;
  label?: string;
  detail?: string;
  amount?: string;
}
