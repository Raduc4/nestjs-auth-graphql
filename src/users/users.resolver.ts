import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserInput, LoginResult } from './dto/users-inputs.dto';

import { UserInputError } from 'apollo-server-core';
import { UsersModel } from './schema/user.schema';

@Resolver(() => UsersModel)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => LoginResult)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<LoginResult> {
    let createdUser: LoginResult | undefined;
    try {
      createdUser = await this.usersService.create(createUserInput);
    } catch (error) {
      throw new UserInputError(error.message);
    }
    return createdUser;
  }
}
