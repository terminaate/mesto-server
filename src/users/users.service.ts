import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import User, { UserDocument } from './models/users.model';
import { Model, Types } from 'mongoose';
import UserToken, { UserTokenDocument } from './models/users-tokens.model';
import { JwtService } from '@nestjs/jwt';
import ApiExceptions from '../exceptions/api.exceptions';
import UserDto from './dto/user.dto';
import CustomHttpException from '../exceptions/custom-http.exception';
import PatchUserDto from './dto/patch-user.dto';
import FilesService from '../files/files.service';

@Injectable()
class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
    @InjectModel(UserToken.name) private usersTokensModel: Model<UserTokenDocument>,
    private jwtService: JwtService,
    private filesService: FilesService,
  ) {
  }

  async createNewUser(user: User): Promise<UserDocument> {
    return await this.usersModel.create(user);
  }

  async findUserByFilter(filter: Record<string, any>): Promise<UserDocument> {
    return this.usersModel.findOne(filter);
  }

  async findUserTokens(userId: string): Promise<UserTokenDocument> {
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
        expiresIn: '1d',
        secret: process.env.JWT_ACCESS_SECRET,
      },
    );
    const refreshToken = this.jwtService.sign(
      { id: userId },
      {
        expiresIn: '30d',
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

  async patchUser(userId: string, { username, bio, email, login, avatar }: PatchUserDto) {
    const user = await this.usersModel.findById(userId);
    if (!user) {
      throw new CustomHttpException(
        ApiExceptions.UserNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const avatarSize = this.filesService.getFileSize(avatar);

    if (!this.filesService.isStringBase64(avatar) || avatarSize === 'n/a') {
      throw new CustomHttpException(
        ApiExceptions.AvatarNotBase64(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!Object.values(avatarSize).includes('gb') && !Object.values(avatarSize).includes('tb')) {
      this.filesService.writeUserAvatar(userId, avatar);
    } else {
      console.log(avatarSize);
      throw new CustomHttpException(
        ApiExceptions.TooLargeAvatarSize(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedFileds: PatchUserDto = {};

    // for (let i of user) {
    //
    // }

    return null;
  }
}

export default UsersService;
