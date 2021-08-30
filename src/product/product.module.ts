import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Module } from '@nestjs/common';
import { CategoryService } from './category/category.service';
import { ProductProvider } from './product.provider';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryController } from './category/category.controller';
import { SharedService } from 'src/shared/shared.service';
import { ImageService } from './image/image.service';
import { ImageController } from './image/image.controller';

@Module({
  imports: [AuthModule],
  controllers: [ProductController, CategoryController, ImageController],
  providers: [
    ProductService,
    CategoryService,
    SharedService,
    ImageService,
    ...ProductProvider,
  ],
  exports: [ImageService, ProductService, CategoryService],
})
export class ProductModule {}
