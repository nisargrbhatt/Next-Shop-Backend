import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  CreatedOrderData,
  FetchedAllPaymentsOfOrderData,
} from 'src/transaction/dto/param.interface';
import { Order } from 'src/transaction/order/order.entity';
import { OrderService } from 'src/transaction/order/order.service';
import { CreatePaymentData } from 'src/transaction/payment/dto/param.interface';
import { Payment } from 'src/transaction/payment/payment.entity';
import { PaymentService } from 'src/transaction/payment/payment.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class CronService {
  private logger = new Logger(CronService.name);

  constructor(
    private orderService: OrderService,
    private transactionService: TransactionService,
    private paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

  /////////////////////////////////////////
  ////////////CRONNERS/////////////////////

  @Cron(CronExpression.EVERY_2_HOURS)
  async handleOrderStatus(): Promise<void> {
    this.logger.log('Handle Order Status Cron Started');

    //* Step 1: Fetch all pending orders
    let fetchedOrders: Order[];
    try {
      fetchedOrders = await this.orderService.findByOrderPending();
    } catch (error) {
      this.logger.error(error);
      return;
    }

    //* Step 2: Start the loop
    for (let i = 0; i < fetchedOrders.length; i++) {
      const currentOrder: Order = fetchedOrders[i];

      //* Step 3: Fetch the current order from Razorpay
      let razorPayOrder: CreatedOrderData;
      try {
        razorPayOrder = await this.transactionService.fetchOrder(
          currentOrder.rp_order_id,
        );
      } catch (error) {
        this.logger.error(error);
        continue;
      }

      //* Step 4: Check the current Status
      if (razorPayOrder.status === 'paid') {
        //* Step 5: Fetch the payments of that order
        let razorPayPayment: FetchedAllPaymentsOfOrderData;
        try {
          razorPayPayment =
            await this.transactionService.fetchAllPaymentsOfOrder(
              currentOrder.rp_order_id,
            );
        } catch (error) {
          this.logger.error(error);
          continue;
        }

        const index = razorPayPayment.items.findIndex(
          (paymentItem) => paymentItem.amount === razorPayOrder.amount,
        );
        if (index > -1) {
          //* Step 6: Create the payment
          const createPaymentData: CreatePaymentData = {
            orderId: currentOrder.id,
            rp_order_id: razorPayPayment.items[index].order_id,
            rp_payment_id: razorPayPayment.items[index].id,
            rp_signature: this.transactionService.generateSignature(
              razorPayPayment.items[index].order_id,
              razorPayPayment.items[index].id,
            ),
          };
          let createdPayment: Payment;
          try {
            createdPayment = await this.paymentService.create(
              createPaymentData,
            );
          } catch (error) {
            this.logger.error(error);
            continue;
          }

          if (!createdPayment) {
            continue;
          }
          //* Step 7: Update the order status
          try {
            await this.orderService.update(
              {
                order_status: true,
              },
              currentOrder.id,
            );
          } catch (error) {
            this.logger.error(error);
            continue;
          }
        }
      }
    }
  }

  /////////////////////////////////////////
  /////////////////////////////////////////
}
