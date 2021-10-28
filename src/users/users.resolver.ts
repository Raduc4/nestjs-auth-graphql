import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserInput, User, UpdateUserInput } from './dto/users-inputs.dto';
import { UsernameEmailAdminGuard } from '../auth/guards/username-email-admin.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UserInputError, ValidationError } from 'apollo-server-core';
import { UsersModel, UserDocument as UserDocument } from './schema/user.schema';
import { AdminAllowedArgs } from '../decorators/admin-allowed-args';

@Resolver(() => UsersModel)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Query((returns) => [UsersModel])
  async users(): Promise<UserDocument[]> {
    return await this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UsersModel)
  async user(@Args('email') email?: string): Promise<UsersModel> {
    let user: UsersModel | undefined;
    if (email) {
      user = await this.usersService.findOneByEmail(email);
    } else {
      // Is this the best exception for a graphQL error?
      throw new ValidationError('A username or email must be included');
    }

    if (user) return user;
    throw new UserInputError('The user does not exist');
  }

  @Mutation(() => UsersModel)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<UsersModel> {
    let createdUser: UsersModel | undefined;
    try {
      createdUser = await this.usersService.create(createUserInput);
    } catch (error) {
      throw new UserInputError(error.message);
    }
    return createdUser;
  }

  // 'addAdminPermission';
  @Mutation(() => UsersModel)
  @UseGuards(JwtAuthGuard, AdminGuard)
  async addAdminPermission(@Args('email') email: string): Promise<User> {
    const user = await this.usersService.addPermission('admin', email);
    if (!user) throw new UserInputError('The user does not exist');
    return user;
  }
  // 'removeAdminPermission';
  @Mutation(() => UsersModel)
  @UseGuards(JwtAuthGuard, AdminGuard)
  async removeAdminPermission(
    @Args('username') username: string,
  ): Promise<User> {
    const user = await this.usersService.removePermission('admin', username);
    if (!user) throw new UserInputError('The user does not exist');
    return user;
  }
}
