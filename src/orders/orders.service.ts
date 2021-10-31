import { Injectable } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schema/orders.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/oreder.dto';
import { CurrentUser } from 'src/decorators/get-user-id.decorator';
import { UsersModel } from 'src/users/schema/user.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}
  async create(createOrderDto: CreateOrderDto, user): Promise<Order> {
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      owner: user._id,
    });
    console.log(createdOrder);
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }
}
