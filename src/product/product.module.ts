import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Module } from '@nestjs/common';
import { CategoryService } from './category/category.service';
import { ProductProvider } from './product.provider';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryController } from './category/category.controller';

@Module({
  imports: [AuthModule],
  controllers: [ProductController, CategoryController],
  providers: [ProductService, CategoryService, ...ProductProvider],
  exports: [ProductService, CategoryService],
})
export class ProductModule {}
