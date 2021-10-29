import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersModel, UserDocument as UserDocument } from './schema/user.schema';
import { AuthService } from '../auth/auth.service';
import { CreateUserInput } from './dto/users-inputs.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  /**
   * Creates a user
   *
   * @param {CreateUserInput} createUserInput username, email, and password. Username and email must be
   * unique, will throw an email with a description if either are duplicates
   * @returns {Promise<UserDocument>} or throws an error
   * @memberof UsersService
   */
  async create(createUserInput: CreateUserInput): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserInput);

    let user: UserDocument | undefined;
    try {
      user = await createdUser.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
    return user;
  }
  // ---------------------------------------------------------
  /**
   * Returns a user by their unique email address or undefined
   *
   * @param {string} email address of user, not case sensitive
   * @returns {(Promise<UserDocument | undefined>)}
   * @memberof UsersService
   */
  async findOneByEmail(email: string): Promise<UserDocument | undefined> {
    const user = await this.userModel
      .findOne({ lowercaseEmail: email.toLowerCase() })
      .exec();
    if (user) return user;
    return undefined;
  }
  // ----------------------------------------------------------
  /**
   * Deletes all the users in the database, used for testing
   *
   * @returns {Promise<void>}
   * @memberof UsersService
   */
  async deleteAllUsers(): Promise<void> {
    await this.userModel.deleteMany({});
  }
}
