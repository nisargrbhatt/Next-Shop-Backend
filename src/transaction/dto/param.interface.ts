//*-------------- Customer -------------*//
export interface CreateCustomerData {
  name: string;
  contact?: number;
  email?: string;
  fail_existing: 0 | 1;
  gstin?: string;
  notes: Notes;
}

export interface Notes {
  [key: string]: string | number;
}

export interface CreatedCustomerData {
  id: string;
  entity?: string;
  name?: string;
  contact?: number;
  email?: string;
  gstin?: string;
  notes?: Notes;
  created_at?: number;
}

export interface EditCustomerData {
  email?: string;
  name?: string;
  contact?: number;
}

//*--------------- Order ----------------*//
export interface CreateOrderData {
  amount: number; //! (In Paisa)
  currency: string;
  receipt: string;
  notes: Notes;
  customer_id?: string;
  partial_payment?: boolean;
}

export interface CreatedOrderData {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  customer_id?: string;
  receipt: string;
  offer_id?: string;
  status: string;
  attempts: number;
  notes: Notes;
  created_at: number;
}

export interface FetchedAllOrdersData {
  entity: string;
  count: number;
  items: CreatedOrderData[];
}

export interface FetchedAllPaymentsOfOrderData {
  entity: string;
  count: number;
  items: PaymentData[];
}

export interface PaymentData {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  invoice_id?: string;
  international: boolean;
  method: string;
  amount_refunded: number;
  refund_status?: string;
  captured: boolean;
  description: string;
  card_id: string;
  bank?: string;
  wallet?: string;
  vpa?: string;
  email?: string;
  contact?: string;
  notes: Notes;
  fee: number;
  tax: number;
  error_code?: any;
  error_description?: string;
  created_at: number;
}

//*--------------- Payment ---------------*//

export interface CapturedPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  invoice_id?: string;
  international: boolean;
  method: string;
  amount_refunded: number;
  refund_status?: string;
  captured: boolean;
  description: string;
  card_id?: string;
  bank?: string;
  wallet?: string;
  vpa: string;
  email?: string;
  contact?: string;
  customer_id?: string;
  notes: Notes;
  fee: number;
  tax: number;
  error_code?: any;
  error_description?: string;
  error_source?: any;
  error_step?: any;
  error_reason?: any;
  acquirer_data?: any; //! Key Value Pair Data
  created_at: number;
}

export interface FetchedAllPayments {
  entity: string;
  count: number;
  items: CapturedPayment[];
}

export interface CreatedNormalRefund {
  id: string;
  entity: string;
  amount: number;
  receipt?: string;
  currency: string;
  payment_id: string;
  notes: Notes;
  acquirer_data: AcquirerData;
  created_at: number;
  batch_id?: string;
  status: string;
  speed_processed: string;
}

export interface AcquirerData {
  [key: string]: any;
}
