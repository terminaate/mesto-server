import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import User, { UserDocument } from './models/users.model';
import { Model, Types } from 'mongoose';
import UserTokens, { UserTokensDocument } from './models/user-tokens.model';
import { JwtService } from '@nestjs/jwt';
import ApiExceptions from '../exceptions/api.exceptions';
import UserDto from './dto/user.dto';
import CustomHttpException from '../exceptions/custom-http.exception';

@Injectable()
class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
    @InjectModel(UserTokens.name)
    private usersTokensModel: Model<UserTokensDocument>,
    private jwtService: JwtService,
  ) {
  }

  async createNewUser(user: User): Promise<UserDocument> {
    return await this.usersModel.create(user);
  }

  async findUserByFilter(filter: {
    [key: string]: any;
  }): Promise<UserDocument> {
    return this.usersModel.findOne(filter);
  }

  async findUserTokens(userId: string): Promise<UserTokensDocument> {
    return this.usersTokensModel.findOne({ userId });
  }

  async refreshUserTokens(refreshToken: string) {
    const userTokens = await this.usersTokensModel.findOne({ refreshToken });
    if (!userTokens) {
      return null;
    }
    return await this.generateUserTokens(userTokens.userId, true);
  }

  async generateUserTokens(userId: string, save = false) {
    const accessToken = this.jwtService.sign(
      { id: userId },
      {
        expiresIn: '30m',
        secret: process.env.JWT_ACCESS_SECRET,
      },
    );
    const refreshToken = this.jwtService.sign(
      { id: userId },
      {
        expiresIn: '1d',
        secret: process.env.JWT_REFRESH_SECRET,
      },
    );
    if (save) {
      const userTokens = await this.usersTokensModel.findOne({ userId });
      if (!userTokens) {
        await this.usersTokensModel.create({
          userId,
          accessToken,
          refreshToken,
        });
      } else {
        userTokens.accessToken = accessToken;
        userTokens.refreshToken = refreshToken;
        await userTokens.save();
      }
    }
    return { accessToken, refreshToken };
  }

  async getUserByIdent(ident: string) {
    const filter: { $or: { [key: string]: string }[] } = { $or: [{ username: ident }] };
    if (Types.ObjectId.isValid(ident)) {
      filter.$or.push({ _id: ident });
    }
    const user = await this.usersModel.findOne(filter);
    if (!user) {
      throw new CustomHttpException(ApiExceptions.UserNotExist(), HttpStatus.BAD_REQUEST);
    }
    return new UserDto(user);
  }
}

export default UsersService;
