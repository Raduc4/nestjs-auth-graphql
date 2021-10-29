import { Resolver, Args, Query, Context, Mutation } from '@nestjs/graphql';
import { LoginResult, LoginUserInput } from '../users/dto/users-inputs.dto';
import { AuthService } from './auth.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersModel, UserDocument } from '../users/schema/user.schema';

type Login = {
  user: UsersModel;
  token: String;
};

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => LoginResult)
  async login(@Args('user') user: LoginUserInput): Promise<Login> {
    const result = await this.authService.validateUserByPassword(user);

    if (result) return result;
    throw new BadRequestException(
      'Could not log-in with the provided credentials',
    );
  }

  // There is no username guard here because if the person has the token, they can be any user
  @Query(() => String)
  async refreshToken(@Context('req') request: any): Promise<string> {
    const user: UserDocument = request.user;
    if (!user)
      throw new UnauthorizedException(
        'Could not log-in with the provided credentials',
      );
    const result = await this.authService.createJwt(user);
    if (result) return result.token;
    throw new UnauthorizedException(
      'Could not log-in with the provided credentials',
    );
  }
}
