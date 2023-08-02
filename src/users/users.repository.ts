import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './models/users.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserToken, UserTokenDocument } from './models/users-tokens.model';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
    @InjectModel(UserToken.name) private usersTokensModel: Model<UserTokenDocument>,
  ) {}

  public async createNewUser(user: User): Promise<UserDocument> {
    return this.usersModel.create(user);
  }

  public async findUserByFilter(filter: Record<string, any>): Promise<UserDocument> {
    return this.usersModel.findOne(filter);
  }

  public async findUserById(userId: string): Promise<UserDocument> {
    return this.usersModel.findById(userId);
  }

  public async findUsers(filter: Record<string, any>): Promise<UserDocument[]> {
    return this.usersModel.find(filter);
  }

  public async createNewUserToken(token: UserToken): Promise<UserTokenDocument> {
    return this.usersTokensModel.create(token);
  }

  public async findUserTokenByUserId(userId: string): Promise<UserTokenDocument> {
    return this.usersTokensModel.findOne({ userId });
  }

  public async findUserTokenByFilter(filter: Record<string, any>): Promise<UserTokenDocument> {
    return this.usersTokensModel.findOne(filter);
  }

  public async deleteUserTokenByUserId(userId: string): Promise<void> {
    await this.usersTokensModel.deleteOne({ userId });
  }
}
