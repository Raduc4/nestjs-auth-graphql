import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';
import { Order } from '../schema/orders.schema';

// @InputType()
// export class CreateOrderDto {
//   @Field()
//   name: string;

//   @Field(() => Order)
//   owner: Order;
// }

@InputType()
export class CreateOrderDto {
  @Field()
  name: string;

  owner: string;
}

@ObjectType()
export class CreatedOrderDto {
  @Field()
  _id: string;
  @Field()
  name: string;

  @Field()
  owner: string;
}
