import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { Order } from './schema/orders.schema';
import { UseGuards } from '@nestjs/common';
import { CreatedOrderDto, CreateOrderDto } from './dto/oreder.dto';
import { CurrentUser } from 'src/decorators/get-user-id.decorator';
import { UsersModel } from 'src/users/schema/user.schema';

@Resolver()
export class OrdersResolver {
  constructor(private readonly orderService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CreatedOrderDto)
  createOrder(
    @Args('createOrder') createOrderDto: CreateOrderDto,
    @CurrentUser() user: UsersModel,
  ) {
    return this.orderService.create(createOrderDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Order])
  getAllOrders(): Promise<Order[]> {
    return this.orderService.findAll();
  }
}
