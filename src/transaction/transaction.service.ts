import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as Razorpay from 'razorpay';
import {
  CapturedPayment,
  CreateCustomerData,
  CreatedCustomerData,
  CreatedOrderData,
  CreateOrderData,
  EditCustomerData,
  FetchedAllOrdersData,
  FetchedAllPayments,
  FetchedAllPaymentsOfOrderData,
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

  //*-------------- Customer -------------*//
  async createCustomer(
    createCustomerData: CreateCustomerData,
  ): Promise<CreatedCustomerData> {
    return await this.rpInstance.customer.create(createCustomerData);
  }

  async editCustomer(
    editCustomerData: EditCustomerData,
    customerId: string,
  ): Promise<CreatedCustomerData> {
    return await this.rpInstance.customers.edit(customerId, editCustomerData);
  }

  async fetchAllCustomers(
    currentPage: number,
    pageSize: number,
  ): Promise<void> {
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
    currentPage: number,
    pageSize: number,
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
    currentPage: number,
    pageSize: number,
  ): Promise<FetchedAllPayments> {
    return await this.rpInstance.payments.all({
      count: pageSize,
      skip: (currentPage - 1) * pageSize,
    });
  }

  async fetchPayment(paymentId: string): Promise<CapturedPayment> {
    return await this.rpInstance.payments.fetch(paymentId);
  }
}
