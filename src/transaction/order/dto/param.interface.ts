export interface CreateServerOrderData {
  rp_order_id: string;
  rp_customer_id: string;
  order_status: boolean;
  userId: string;
  addressId: string;
  productId: string;
  priceId: string;
  merchantId: string;
  manufacturerId: string;
  amount: number;
}
