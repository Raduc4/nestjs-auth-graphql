import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PasswordResetSchema } from './password-reset.schema';
import * as bcrypt from 'bcryptjs';

export type UserDocument = UsersModel &
  Document & {
    password: string;
    lowercaseEmail: string;
    passwordReset?: {
      token: string;
      expiration: Date;
    };
    checkPassword(password: string): Promise<boolean>;
  };

@Schema()
@ObjectType()
export class UsersModel {
  @Field()
  _id: string;

  @Field(() => String)
  @Prop({
    required: true,
    unique: true,
    validate: { validator: validateEmail },
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field(() => [String!]!)
  @Prop({
    type: [String!]!,
    required: true,
  })
  permissions: string[];

  @Field(() => String)
  @Prop({
    type: String,
    unique: true,
  })
  lowercaseEmail: string;

  @Prop({ type: PasswordResetSchema })
  passwordReset: typeof PasswordResetSchema;

  @Prop({
    type: Boolean,
    default: true,
  })
  enabled: boolean;

  @Field(() => Date)
  @Prop()
  timestamp: Date;
}

export const UsersSchema = SchemaFactory.createForClass(UsersModel);

function validateEmail(email: string) {
  const expression =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return expression.test(email);
}

UsersSchema.statics.validateEmail = function (email: string): boolean {
  return validateEmail(email);
};

UsersSchema.pre<UserDocument>('save', function (next) {
  const user = this;

  user.lowercaseEmail = user.email.toLowerCase();

  // Make sure not to rehash the password if it is already hashed
  if (!user.isModified('password')) {
    return next();
  }

  // Generate a salt and use it to hash the user's password
  bcrypt.genSalt(10, (genSaltError, salt) => {
    if (genSaltError) {
      return next(genSaltError);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

UsersSchema.methods.checkPassword = function (
  password: string,
): Promise<boolean> {
  const user = this as UserDocument;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (error, isMatch) => {
      if (error) {
        reject(error);
      }

      resolve(isMatch);
    });
  });
};
