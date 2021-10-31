import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UsersModel } from '../../users/schema/user.schema';
import * as mongoose from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

export type OrderDocument = Order & Document;

@Schema()
@ObjectType()
export class Order {
  @Prop()
  @Field()
  name: string;

  @Field(() => UsersModel)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: UsersModel;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
