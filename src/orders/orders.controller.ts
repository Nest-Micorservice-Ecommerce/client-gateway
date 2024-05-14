import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, ParseUUIDPipe, Query } from '@nestjs/common';
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, OrderPaginationDto, StatusOrderDto } from './dto';
import { PaginationDto } from 'src/common';



@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send('findAllOrders', orderPaginationDto);
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = this.client.send('findOneOrder', { id });
      return order;
    } catch (error) {
      throw new RpcException(error)
    }
  }


  @Get(':status')
  async findAllByStatus(
    @Param() statusOrderDto: StatusOrderDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {

      return this.client.send('findAllOrders', {
        status: statusOrderDto.status,
        ...paginationDto,
      });

    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusOrderDto: StatusOrderDto
  ) {
    try {
      return this.client.send('changeOrderStatus', { id, status: statusOrderDto.status })
    } catch (error) {
      throw new RpcException(error)
    };
  }

}
