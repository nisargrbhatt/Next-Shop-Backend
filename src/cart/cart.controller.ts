import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('cart')
@ApiTags('Cart')
export class CartController {}
