import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as Razorpay from 'razorpay';
import * as hmacSHA256 from 'crypto-js/hmac-sha256';

import {
  CapturedPayment,
  CreateCustomerData,
  CreatedCustomerData,
  CreatedNormalRefund,
  CreatedOrderData,
  CreateOrderData,
  EditCustomerData,
  FetchedAllCustomers,
  FetchedAllOrdersData,
  FetchedAllPayments,
  FetchedAllPaymentsOfOrderData,
  FetchedRefund,
} from './dto/param.interface';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  private rpInstance;

  // private rpInstance = new Razorpay({
  //   key_id: this.configService.get('RAZORPAY_KEYID'),
  //   key_secret: this.configService.get('RAZORPAY_KEYSECRET'),
  // });

  constructor(private configService: ConfigService) {
    try {
      this.rpInstance = new Razorpay({
        key_id: this.configService.get('RAZORPAY_KEYID'),
        key_secret: this.configService.get('RAZORPAY_KEYSECRET'),
      });
      this.logger.log('Razorpay initialized Successfully');
    } catch (error) {
      this.logger.error('Razorpay initialization failed');
      this.logger.error(error);
    }
  }

  randomRecieptId(): string {
    return `NS-RP-Recipt-${Date.now()}`;
  }

  checkSignature(
    rp_order_id: string,
    rp_payment_id: string,
    rp_signature: string,
  ): boolean {
    const generatedSignature = hmacSHA256(
      rp_order_id + '|' + rp_payment_id,
      this.configService.get('RAZORPAY_KEYSECRET'),
    ).toString();
    if (generatedSignature === rp_signature) {
      return true;
    }
    return false;
  }

  generateSignature(rp_order_id: string, rp_payment_id: string): string {
    return hmacSHA256(
      rp_order_id + '|' + rp_payment_id,
      this.configService.get('RAZORPAY_KEYSECRET'),
    ).toString();
  }

  //*-------------- Customer -------------*//
  async createCustomer(
    createCustomerData: CreateCustomerData,
  ): Promise<CreatedCustomerData> {
    return await this.rpInstance.customers.create(createCustomerData);
  }

  async editCustomer(
    editCustomerData: EditCustomerData,
    customerId: string,
  ): Promise<CreatedCustomerData> {
    return await this.rpInstance.customers.edit(customerId, editCustomerData);
  }

  async fetchAllCustomers(
    currentPage?: number,
    pageSize?: number,
  ): Promise<FetchedAllCustomers> {
    return await this.rpInstance.customers.all({
      count: pageSize,
      skip: (currentPage - 1) * pageSize,
    });
  }

  async fetchCustomer(customerId: string): Promise<CreatedCustomerData> {
    return await this.rpInstance.customers.fetch(customerId);
  }

  //*--------------- Order ----------------*//
  async createOrder(
    createOrderData: CreateOrderData,
  ): Promise<CreatedOrderData> {
    return await this.rpInstance.orders.create(createOrderData);
  }

  async fetchAllOrders(
    currentPage?: number,
    pageSize?: number,
  ): Promise<FetchedAllOrdersData> {
    return await this.rpInstance.orders.all({
      count: pageSize,
      skip: (currentPage - 1) * pageSize,
    });
  }

  async fetchOrder(orderId: string): Promise<CreatedOrderData> {
    return await this.rpInstance.orders.fetch(orderId);
  }

  async fetchAllPaymentsOfOrder(
    orderId: string,
  ): Promise<FetchedAllPaymentsOfOrderData> {
    return await this.rpInstance.orders.fetchPayments(orderId);
  }

  //*--------------- Payment ---------------*//
  //! This is used to fetch the amount from Razorpay account to your bussiness account
  async capturePayment(
    paymentId: string,
    amount: number,
    currency: string,
  ): Promise<CapturedPayment> {
    return await this.rpInstance.payments.capture(paymentId, amount, currency);
  }

  async fetchAllPayments(
    currentPage?: number,
    pageSize?: number,
  ): Promise<FetchedAllPayments> {
    return await this.rpInstance.payments.all({
      count: pageSize,
      skip: (currentPage - 1) * pageSize,
    });
  }

  async fetchPayment(paymentId: string): Promise<CapturedPayment> {
    return await this.rpInstance.payments.fetch(paymentId);
  }

  //*--------------- Refund ---------------*//
  async createNormalRefund(
    paymentId: string,
    amount: number,
  ): Promise<CreatedNormalRefund> {
    return await this.rpInstance.payments.refund(paymentId, {
      amount: amount,
      speed: 'normal',
    });
  }

  async fetchRefund(refundId: string): Promise<FetchedRefund> {
    return await this.rpInstance.refunds.fetch(refundId);
  }
}
