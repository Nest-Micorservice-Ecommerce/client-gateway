import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) { }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send({ cmd: 'createProduct' }, createProductDto);
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'findAllProducts' }, paginationDto);
  }

  @Get(':id')
  async findProduct(@Param('id', ParseIntPipe) id: number) {

    return this.client.send({ cmd: 'findOneProduct' }, { id })
      .pipe(
        catchError(err => {
          throw new RpcException(err)
        })
      )
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {

    return this.client.send({ cmd: 'updateProduct' }, { ...updateProductDto, id })
      .pipe(
        catchError(err => {
          throw new RpcException(err)
        })
      );
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'deleteProduct' }, { id })
    .pipe(
      catchError(err => {
        throw new RpcException(err)
      })
    );
  }



}
