import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProductFindAllPaginate, RequestWithUser } from '../type';
import { ProductDocument } from './schema/product.schema';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createProductDto: CreateProductDto,
    @Request() req: RequestWithUser,
  ): Promise<ProductDocument> {
    return this.productService.create(createProductDto, req.user.email);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<ProductFindAllPaginate | undefined> {
    return this.productService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId): Promise<ProductDocument | undefined> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: ObjectId,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument | undefined> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId): Promise<ProductDocument | undefined> {
    return this.productService.remove(id);
  }

  @Post('seed')
  seed(): Promise<ProductDocument[]> {
    return this.productService.seed();
  }
}
