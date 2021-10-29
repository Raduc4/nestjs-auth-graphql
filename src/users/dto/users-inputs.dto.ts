import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { UsersModel } from '../schema/user.schema';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: string;
  @Field(() => String)
  password: string;
}

@InputType()
export class LoginUserInput {
  @Field(() => String)
  email?: string;
  @Field(() => String)
  password: string;
}

@InputType()
export class UpdatePasswordInput {
  @Field(() => String)
  oldPassword: string;
  @Field(() => String)
  newPassword: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  username?: string;
  @Field(() => String)
  email?: string;
  password?: UpdatePasswordInput;
  @Field(() => Boolean)
  enabled?: boolean;
}

@ObjectType()
export class LoginResult {
  @Field(() => UsersModel)
  user: UsersModel;
  @Field(() => String)
  token: string;
}

@ObjectType()
export class SignOutResult {
  @Field(() => UsersModel)
  user: UsersModel;
  @Field(() => null)
  token: null;
}

@InputType()
export class User {
  @Field(() => String)
  email: string;
  @Field(() => [String])
  permissions: string[];
  @Field(() => Boolean)
  enabled: boolean;
  @Field(() => String)
  _id: string;
}

// export type ObjectId = any;

// export abstract class IMutation {
//   abstract createUser(createUserInput?: CreateUserInput): User | Promise<User>;

//   abstract updateUser(
//     fieldsToUpdate: UpdateUserInput,
//     username?: string,
//   ): User | Promise<User>;

//   abstract addAdminPermission(username: string): User | Promise<User>;

//   abstract removeAdminPermission(username: string): User | Promise<User>;

//   abstract resetPassword(
//     username: string,
//     code: string,
//     password: string,
//   ): User | Promise<User>;
// }

// export abstract class IQuery {
//   abstract login(user: LoginUserInput): LoginResult | Promise<LoginResult>;

//   abstract refreshToken(): string | Promise<string>;

//   abstract users(): User[] | Promise<User[]>;

//   abstract user(username?: string, email?: string): User | Promise<User>;

//   abstract forgotPassword(email?: string): boolean | Promise<boolean>;
// }
