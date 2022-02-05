import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { NS_002 } from 'src/core/constants/error_codes';
import { SharedService } from 'src/shared/shared.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { User } from 'src/user/user.entity';
import { AnalyticService } from './analytic.service';
import {
  GetAcceptedOrderOfMerchantByMonthResponse,
  GetAcceptedOrderOfMerchantByMonthResponseData,
} from './dto/response.dto';

@Controller('analytic')
@ApiTags('Analytic')
export class AnalyticController {
  private logger = new Logger(AnalyticController.name);

  constructor(
    private analyticService: AnalyticService,
    private sharedService: SharedService,
    private transactionService: TransactionService,
  ) {}

  //*--- Merchant ---//
  @Get('getAcceptedOrderOfMerchantByMonth')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetAcceptedOrderOfMerchantByMonthResponse })
  async getAcceptedOrderOfMerchantByMonth(
    @Req() req: { user: User },
    @Res() res: Response,
  ) {
    let response: GetAcceptedOrderOfMerchantByMonthResponse;

    const responseData: GetAcceptedOrderOfMerchantByMonthResponseData = {
      data: [],
      barLabels: [],
      label: 'Accepted Orders',
    };

    const past12Dates: Array<{ label: string; start: Date; end: Date }> =
      this.sharedService.getPast12MonthsDates();

    for (let i = 0; i < past12Dates.length; i++) {
      const currentDate: { label: string; start: Date; end: Date } =
        past12Dates[i];

      let fetchedCount: number;
      try {
        fetchedCount =
          await this.analyticService.getAcceptedOrderOfMerchantByMonth(
            req.user.id,
            currentDate.start,
            currentDate.end,
          );
      } catch (error) {
        this.logger.error(error);
        response = {
          message: 'Something went wrong',
          valid: false,
          error: NS_002,
          dialog: {
            header: 'Server error',
            message: 'There is some error in server. Please try again later',
          },
        };
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }

      responseData.data.push(fetchedCount ? fetchedCount : 0);
      responseData.barLabels.push(currentDate.label);
    }

    response = {
      message: 'Orders Series fetched successfully',
      valid: true,
      data: responseData,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getRejectedOrderOfMerchantByMonth')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetAcceptedOrderOfMerchantByMonthResponse })
  async getRejectedOrderOfMerchantByMonth(
    @Req() req: { user: User },
    @Res() res: Response,
  ) {
    let response: GetAcceptedOrderOfMerchantByMonthResponse;

    const responseData: GetAcceptedOrderOfMerchantByMonthResponseData = {
      data: [],
      barLabels: [],
      label: 'Rejected Orders',
    };

    const past12Dates: Array<{ label: string; start: Date; end: Date }> =
      this.sharedService.getPast12MonthsDates();

    for (let i = 0; i < past12Dates.length; i++) {
      const currentDate: { label: string; start: Date; end: Date } =
        past12Dates[i];

      let fetchedCount: number;
      try {
        fetchedCount =
          await this.analyticService.getRejectedOrderOfMerchantByMonth(
            req.user.id,
            currentDate.start,
            currentDate.end,
          );
      } catch (error) {
        this.logger.error(error);
        response = {
          message: 'Something went wrong',
          valid: false,
          error: NS_002,
          dialog: {
            header: 'Server error',
            message: 'There is some error in server. Please try again later',
          },
        };
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }

      responseData.data.push(fetchedCount ? fetchedCount : 0);
      responseData.barLabels.push(currentDate.label);
    }

    response = {
      message: 'Orders Series fetched successfully',
      valid: true,
      data: responseData,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getDeliveredOrderOfMerchantByMonth')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetAcceptedOrderOfMerchantByMonthResponse })
  async getDeliveredOrderOfMerchantByMonth(
    @Req() req: { user: User },
    @Res() res: Response,
  ) {
    let response: GetAcceptedOrderOfMerchantByMonthResponse;

    const responseData: GetAcceptedOrderOfMerchantByMonthResponseData = {
      data: [],
      barLabels: [],
      label: 'Delivered Orders',
    };

    const past12Dates: Array<{ label: string; start: Date; end: Date }> =
      this.sharedService.getPast12MonthsDates();

    for (let i = 0; i < past12Dates.length; i++) {
      const currentDate: { label: string; start: Date; end: Date } =
        past12Dates[i];

      let fetchedCount: number;
      try {
        fetchedCount =
          await this.analyticService.getDeliveredOrderOfMerchantByMonth(
            req.user.id,
            currentDate.start,
            currentDate.end,
          );
      } catch (error) {
        this.logger.error(error);
        response = {
          message: 'Something went wrong',
          valid: false,
          error: NS_002,
          dialog: {
            header: 'Server error',
            message: 'There is some error in server. Please try again later',
          },
        };
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }

      responseData.data.push(fetchedCount ? fetchedCount : 0);
      responseData.barLabels.push(currentDate.label);
    }

    response = {
      message: 'Orders Series fetched successfully',
      valid: true,
      data: responseData,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getCanceledOrderOfMerchantByMonth')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetAcceptedOrderOfMerchantByMonthResponse })
  async getCanceledOrderOfMerchantByMonth(
    @Req() req: { user: User },
    @Res() res: Response,
  ) {
    let response: GetAcceptedOrderOfMerchantByMonthResponse;

    const responseData: GetAcceptedOrderOfMerchantByMonthResponseData = {
      data: [],
      barLabels: [],
      label: 'Canceled Orders',
    };

    const past12Dates: Array<{ label: string; start: Date; end: Date }> =
      this.sharedService.getPast12MonthsDates();

    for (let i = 0; i < past12Dates.length; i++) {
      const currentDate: { label: string; start: Date; end: Date } =
        past12Dates[i];

      let fetchedCount: number;
      try {
        fetchedCount =
          await this.analyticService.getCanceledOrderOfMerchantByMonth(
            req.user.id,
            currentDate.start,
            currentDate.end,
          );
      } catch (error) {
        this.logger.error(error);
        response = {
          message: 'Something went wrong',
          valid: false,
          error: NS_002,
          dialog: {
            header: 'Server error',
            message: 'There is some error in server. Please try again later',
          },
        };
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }

      responseData.data.push(fetchedCount ? fetchedCount : 0);
      responseData.barLabels.push(currentDate.label);
    }

    response = {
      message: 'Orders Series fetched successfully',
      valid: true,
      data: responseData,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getUnpaidOrderOfMerchantByMonth')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetAcceptedOrderOfMerchantByMonthResponse })
  async getUnpaidOrderOfMerchantByMonth(
    @Req() req: { user: User },
    @Res() res: Response,
  ) {
    let response: GetAcceptedOrderOfMerchantByMonthResponse;

    const responseData: GetAcceptedOrderOfMerchantByMonthResponseData = {
      data: [],
      barLabels: [],
      label: 'Unpaid Orders',
    };

    const past12Dates: Array<{ label: string; start: Date; end: Date }> =
      this.sharedService.getPast12MonthsDates();

    for (let i = 0; i < past12Dates.length; i++) {
      const currentDate: { label: string; start: Date; end: Date } =
        past12Dates[i];

      let fetchedCount: number;
      try {
        fetchedCount =
          await this.analyticService.getUnpaidOrderOfMerchantByMonth(
            req.user.id,
            currentDate.start,
            currentDate.end,
          );
      } catch (error) {
        this.logger.error(error);
        response = {
          message: 'Something went wrong',
          valid: false,
          error: NS_002,
          dialog: {
            header: 'Server error',
            message: 'There is some error in server. Please try again later',
          },
        };
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }

      responseData.data.push(fetchedCount ? fetchedCount : 0);
      responseData.barLabels.push(currentDate.label);
    }

    response = {
      message: 'Orders Series fetched successfully',
      valid: true,
      data: responseData,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  //*---- Admin ----//

  @Get('getAllAuthorisedOrdersOfPlayformByMonth')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetAcceptedOrderOfMerchantByMonthResponse })
  async getAllAuthorisedOrdersOfPlayformByMonth(
    @Req() req: { user: User },
    @Res() res: Response,
  ) {
    let response: GetAcceptedOrderOfMerchantByMonthResponse;

    const responseData: GetAcceptedOrderOfMerchantByMonthResponseData = {
      data: [],
      barLabels: [],
      label: 'Authorised Orders',
    };

    const past12Dates: Array<{ label: string; start: Date; end: Date }> =
      this.sharedService.getPast12MonthsDates();

    for (let i = 0; i < past12Dates.length; i++) {
      const currentDate: { label: string; start: Date; end: Date } =
        past12Dates[i];

      let fetchedCount: number;
      try {
        fetchedCount =
          await this.transactionService.fetchAllAuthorisedOrdersByDate(
            currentDate.start,
            currentDate.end,
          );
      } catch (error) {
        this.logger.error(error);
        response = {
          message: 'Something went wrong',
          valid: false,
          error: NS_002,
          dialog: {
            header: 'Server error',
            message: 'There is some error in server. Please try again later',
          },
        };
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }

      responseData.data.push(fetchedCount ? fetchedCount : 0);
      responseData.barLabels.push(currentDate.label);
    }

    response = {
      message: 'Orders Series fetched successfully',
      valid: true,
      data: responseData,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getAllOrdersOfPlayformByMonth')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetAcceptedOrderOfMerchantByMonthResponse })
  async getAllOrdersOfPlayformByMonth(
    @Req() req: { user: User },
    @Res() res: Response,
  ) {
    let response: GetAcceptedOrderOfMerchantByMonthResponse;

    const responseData: GetAcceptedOrderOfMerchantByMonthResponseData = {
      data: [],
      barLabels: [],
      label: 'Generated Orders',
    };

    const past12Dates: Array<{ label: string; start: Date; end: Date }> =
      this.sharedService.getPast12MonthsDates();

    for (let i = 0; i < past12Dates.length; i++) {
      const currentDate: { label: string; start: Date; end: Date } =
        past12Dates[i];

      let fetchedCount: number;
      try {
        fetchedCount = await this.transactionService.fetchAllOrdersByDate(
          currentDate.start,
          currentDate.end,
        );
      } catch (error) {
        this.logger.error(error);
        response = {
          message: 'Something went wrong',
          valid: false,
          error: NS_002,
          dialog: {
            header: 'Server error',
            message: 'There is some error in server. Please try again later',
          },
        };
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }

      responseData.data.push(fetchedCount ? fetchedCount : 0);
      responseData.barLabels.push(currentDate.label);
    }

    response = {
      message: 'Orders Series fetched successfully',
      valid: true,
      data: responseData,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getAllPaymentsOfPlayformByMonth')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetAcceptedOrderOfMerchantByMonthResponse })
  async getAllPaymentsOfPlayformByMonth(
    @Req() req: { user: User },
    @Res() res: Response,
  ) {
    let response: GetAcceptedOrderOfMerchantByMonthResponse;

    const responseData: GetAcceptedOrderOfMerchantByMonthResponseData = {
      data: [],
      barLabels: [],
      label: 'Generated Payments',
    };

    const past12Dates: Array<{ label: string; start: Date; end: Date }> =
      this.sharedService.getPast12MonthsDates();

    for (let i = 0; i < past12Dates.length; i++) {
      const currentDate: { label: string; start: Date; end: Date } =
        past12Dates[i];

      let fetchedCount: number;
      try {
        fetchedCount = await this.transactionService.fetchAllPaymentsByDate(
          currentDate.start,
          currentDate.end,
        );
      } catch (error) {
        this.logger.error(error);
        response = {
          message: 'Something went wrong',
          valid: false,
          error: NS_002,
          dialog: {
            header: 'Server error',
            message: 'There is some error in server. Please try again later',
          },
        };
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }

      responseData.data.push(fetchedCount ? fetchedCount : 0);
      responseData.barLabels.push(currentDate.label);
    }

    response = {
      message: 'Payments Series fetched successfully',
      valid: true,
      data: responseData,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  //*---- Manufacturer ----*//

  @Get('getPendingOrdersOfManufacturerByMonth')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetAcceptedOrderOfMerchantByMonthResponse })
  async getPendingOrdersOfManufacturerByMonth(
    @Req() req: { user: User },
    @Res() res: Response,
  ) {
    let response: GetAcceptedOrderOfMerchantByMonthResponse;

    const responseData: GetAcceptedOrderOfMerchantByMonthResponseData = {
      data: [],
      barLabels: [],
      label: 'Pending Orders',
    };

    const past12Dates: Array<{ label: string; start: Date; end: Date }> =
      this.sharedService.getPast12MonthsDates();

    for (let i = 0; i < past12Dates.length; i++) {
      const currentDate: { label: string; start: Date; end: Date } =
        past12Dates[i];

      let fetchedCount: number;
      try {
        fetchedCount =
          await this.analyticService.getPendingOrdersOfManufacturerByMonth(
            req.user.id,
            currentDate.start,
            currentDate.end,
          );
      } catch (error) {
        this.logger.error(error);
        response = {
          message: 'Something went wrong',
          valid: false,
          error: NS_002,
          dialog: {
            header: 'Server error',
            message: 'There is some error in server. Please try again later',
          },
        };
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }

      responseData.data.push(fetchedCount ? fetchedCount : 0);
      responseData.barLabels.push(currentDate.label);
    }

    response = {
      message: 'Orders Series fetched successfully',
      valid: true,
      data: responseData,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getAcceptedOrdersOfManufacturerByMonth')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetAcceptedOrderOfMerchantByMonthResponse })
  async getAcceptedOrdersOfManufacturerByMonth(
    @Req() req: { user: User },
    @Res() res: Response,
  ) {
    let response: GetAcceptedOrderOfMerchantByMonthResponse;

    const responseData: GetAcceptedOrderOfMerchantByMonthResponseData = {
      data: [],
      barLabels: [],
      label: 'Accepted Orders',
    };

    const past12Dates: Array<{ label: string; start: Date; end: Date }> =
      this.sharedService.getPast12MonthsDates();

    for (let i = 0; i < past12Dates.length; i++) {
      const currentDate: { label: string; start: Date; end: Date } =
        past12Dates[i];

      let fetchedCount: number;
      try {
        fetchedCount =
          await this.analyticService.getAcceptedOrdersOfManufacturerByMonth(
            req.user.id,
            currentDate.start,
            currentDate.end,
          );
      } catch (error) {
        this.logger.error(error);
        response = {
          message: 'Something went wrong',
          valid: false,
          error: NS_002,
          dialog: {
            header: 'Server error',
            message: 'There is some error in server. Please try again later',
          },
        };
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }

      responseData.data.push(fetchedCount ? fetchedCount : 0);
      responseData.barLabels.push(currentDate.label);
    }

    response = {
      message: 'Orders Series fetched successfully',
      valid: true,
      data: responseData,
    };
    return res.status(HttpStatus.OK).json(response);
  }
  @Get('getCanceledOrdersOfManufacturerByMonth')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetAcceptedOrderOfMerchantByMonthResponse })
  async getCanceledOrdersOfManufacturerByMonth(
    @Req() req: { user: User },
    @Res() res: Response,
  ) {
    let response: GetAcceptedOrderOfMerchantByMonthResponse;

    const responseData: GetAcceptedOrderOfMerchantByMonthResponseData = {
      data: [],
      barLabels: [],
      label: 'Canceled Orders',
    };

    const past12Dates: Array<{ label: string; start: Date; end: Date }> =
      this.sharedService.getPast12MonthsDates();

    for (let i = 0; i < past12Dates.length; i++) {
      const currentDate: { label: string; start: Date; end: Date } =
        past12Dates[i];

      let fetchedCount: number;
      try {
        fetchedCount =
          await this.analyticService.getCanceledOrdersOfManufacturerByMonth(
            req.user.id,
            currentDate.start,
            currentDate.end,
          );
      } catch (error) {
        this.logger.error(error);
        response = {
          message: 'Something went wrong',
          valid: false,
          error: NS_002,
          dialog: {
            header: 'Server error',
            message: 'There is some error in server. Please try again later',
          },
        };
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }

      responseData.data.push(fetchedCount ? fetchedCount : 0);
      responseData.barLabels.push(currentDate.label);
    }

    response = {
      message: 'Orders Series fetched successfully',
      valid: true,
      data: responseData,
    };
    return res.status(HttpStatus.OK).json(response);
  }
}
