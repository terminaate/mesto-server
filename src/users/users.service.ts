import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ApiExceptions from '../exceptions/api.exceptions';
import UserDto from './dto/user.dto';
import CustomHttpException from '../exceptions/custom-http.exception';
import PatchUserDto from './dto/patch-user.dto';
import FilesService from '../files/files.service';
import { InjectModel } from '@nestjs/sequelize';
import User from './models/users.model';
import UserToken from './models/users-tokens.model';
import { UUIDv4 } from 'uuid-v4-validator';

@Injectable()
class UsersService {
  constructor(
    @InjectModel(User) private usersModel: typeof User,
    // @InjectModel(User.name) private usersModel: Model<UserDocument>,
    @InjectModel(UserToken) private usersTokensModel: typeof UserToken,
    private jwtService: JwtService,
    private filesService: FilesService,
  ) {
  }

  async createNewUser(user: User): Promise<User> {
    return await this.usersModel.create(user);
  }

  async findUserByFilter(filter: Record<string, any>): Promise<User> {
    return this.usersModel.findOne({ where: filter });
  }

  async findUserTokens(userId: string): Promise<UserToken> {
    return this.usersTokensModel.findOne({ where: { userId } });
  }

  async refreshUserTokens(refreshToken: string) {
    const userTokens = await this.usersTokensModel.findOne({ where: { refreshToken } });
    if (!userTokens) {
      return null;
    }
    return await this.generateUserTokens(userTokens.userId, true);
  }

  async generateUserTokens(userId: string, save = false) {
    const accessToken = this.jwtService.sign(
      { id: userId },
      {
        expiresIn: '1h',
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
      const userTokens = await this.usersTokensModel.findOne({ where: { userId } });
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

  async getUserByIdent(ident: string, isSelfUser: boolean) {
    const filter: { $or: Record<string, string>[] } = {
      $or: [{ username: ident }],
    };
    if (UUIDv4.validate(ident)) {
      filter.$or.push({ id: ident });
    }
    const user = await this.usersModel.findOne({ where: filter });
    if (!user) {
      throw new CustomHttpException(
        ApiExceptions.UserNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    return new UserDto(user, isSelfUser);
  }

  async patchUser(
    userId: string,
    { avatar, bio, password, username, email, login }: PatchUserDto,
  ) {
    if (!userId) {
      throw new CustomHttpException(
        ApiExceptions.UserIdNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.usersModel.findByPk(userId);
    if (!user) {
      throw new CustomHttpException(
        ApiExceptions.UserIdNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (avatar) {
      const isAvatarValid = this.filesService.validateImage(avatar);
      if (isAvatarValid) {
        this.filesService.writeUserAvatar(userId, avatar);
      }
    } else if (avatar === null) {
      this.filesService.deleteUserAvatar(userId);
    }

    const updatedFields: PatchUserDto = {};
    const newFields = { bio, password, username, email, login };

    for (let i in newFields) {
      if (newFields[i] && user[i] !== newFields[i]) {
        updatedFields[i] = newFields[i];
      }
    }

    await user.update(updatedFields);
    return { ...new UserDto(user), ...updatedFields };
  }

  async deleteUser(userId: string) {
    const user = await this.usersModel.findByPk(userId);
    if (!user) {
      throw new CustomHttpException(
        ApiExceptions.UserIdNotExist(),
        HttpStatus.NOT_FOUND,
      );
    }

    await this.usersTokensModel.destroy({ where: { userId } });
    await user.destroy();

    this.filesService.deleteUserFolder(userId);
    return new UserDto(user);
  }

  async findUsersByFilter(filter: Record<string, any>) {
    if (Object.keys(filter).length <= 0) {
      return [];
    }
    return (await this.usersModel.findAll({ where: filter })).map(
      (user) => new UserDto(user),
    );
  }

  async findTokenByFilter(filter: Record<string, any>) {
    return this.usersTokensModel.findOne({ where: filter });
  }
}

export default UsersService;
