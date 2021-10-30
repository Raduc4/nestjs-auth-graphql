import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { UsersModel, UserDocument } from '../users/schema/user.schema';
import { LoginResult, LoginUserInput } from 'src/users/dto/users-inputs.dto';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private _usersService: UsersService,
    private _jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUserByPassword(
    loginAttempt: LoginUserInput,
  ): Promise<LoginResult | undefined> {
    // This will be used for the initial login
    let userToAttempt: UserDocument | undefined;
    if (loginAttempt.email) {
      userToAttempt = await this._usersService.findOneByEmail(
        loginAttempt.email,
      );
    }

    // If the user is not enabled, disable log in - the token wouldn't work anyways
    if (userToAttempt && userToAttempt.enabled === false)
      userToAttempt = undefined;

    if (!userToAttempt) return undefined;

    // Check the supplied password against the hash stored for this email address
    let isMatch = false;
    try {
      isMatch = await userToAttempt.checkPassword(loginAttempt.password);
    } catch (error) {
      return undefined;
    }

    if (isMatch) {
      // If there is a successful match, generate a JWT for the user
      const token = this.createJwt(userToAttempt!).token;
      const result: LoginResult = {
        user: userToAttempt!,
        token,
      };
      userToAttempt.timestamp = new Date();
      userToAttempt.save();
      return result;
    }

    return undefined;
  }

  /**
   * Verifies that the JWT payload associated with a JWT is valid by making sure the user exists and is enabled
   *
   * @param {JwtPayload} payload
   * @returns {(Promise<UserDocument | undefined>)} returns undefined if there is no user or the account is not enabled
   * @memberof {(AuthService JwtStrategy)}
   */
  async validateJwtPayload(
    payload: JwtPayload,
  ): Promise<UserDocument | undefined> {
    // This will be used when the user has already logged in and has a JWT
    const user = await this._usersService.findOneByEmail(payload.email);

    // Ensure the user exists and their account isn't disabled
    if (user && user.enabled) {
      user.timestamp = new Date();
      user.save();
      return user;
    }

    return undefined;
  }

  createJwt(user: UsersModel): { data: JwtPayload; token: string } {
    const expiresIn = this.configService.jwtExpiresIn;
    let expiration: Date | undefined;
    if (expiresIn) {
      expiration = new Date();
      expiration.setTime(expiration.getTime() + expiresIn * 1000);
    }
    const data: JwtPayload = {
      email: user.email,
      _id: user._id,
      expiration,
    };

    const jwt = this._jwtService.sign(data);

    return {
      data,
      token: jwt,
    };
  }
}
