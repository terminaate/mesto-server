import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import User, { UserDocument } from './models/users.model';
import { Model } from 'mongoose';
import UserTokens, { UserTokensDocument } from './models/user-tokens.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
    @InjectModel(UserTokens.name) private usersTokensModel: Model<UserTokensDocument>,
    private jwtService: JwtService,
  ) {
  }

  async createNewUser(user: User) {
    return await this.usersModel.create(user);
  }

  async findUserByFilter(filter: { [key: string]: any }): Promise<UserDocument> {
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

  async generateUserTokens(userId: string, save = false): Promise<{ accessToken: string, refreshToken: string }> {
    const accessToken = this.jwtService.sign({ id: userId }, {
      expiresIn: '30m',
      secret: process.env.JWT_ACCESS_SECRET,
    });
    const refreshToken = this.jwtService.sign({ id: userId }, {
      expiresIn: '1h',
      secret: process.env.JWT_REFRESH_SECRET,
    });
    if (save) {
      const userTokens = await this.usersTokensModel.findOne({ userId });
      if (!userTokens) {
        await this.usersTokensModel.create({ userId, accessToken, refreshToken });
      } else {
        userTokens.accessToken = accessToken;
        userTokens.refreshToken = refreshToken;
        await userTokens.save();
      }
    }
    return { accessToken, refreshToken };
  }
}
