import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('price')
@ApiTags('Price')
export class PriceController {}
