import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from './dto/user.dto';
import { FilesService } from '../files/files.service';
import { UsersException } from './users.exception';
import { PatchUserDTO } from './dto/patch-user.dto';
import { UsersRepository } from './users.repository';
import { Tokens } from './models/users-tokens.model';

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    private filesService: FilesService,
    private usersRepository: UsersRepository,
  ) {}

  public async refreshUserTokens(refreshToken: string): Promise<Tokens> {
    const userTokens = await this.usersRepository.findUserTokenByFilter({ refreshToken });
    if (!userTokens) {
      return null;
    }
    return this.generateUserTokens(userTokens.userId, true);
  }

  public async generateUserTokens(userId: string, save = false): Promise<Tokens> {
    const accessToken = this.jwtService.sign(
      { id: userId },
      {
        expiresIn: process.env.JWT_ACCESS_LIFE_TIME,
        secret: process.env.JWT_ACCESS_SECRET,
      },
    );
    const refreshToken = this.jwtService.sign(
      { id: userId },
      {
        expiresIn: process.env.JWT_REFRESH_LIFE_TIME,
        secret: process.env.JWT_REFRESH_SECRET,
      },
    );
    if (save) {
      const userTokens = await this.usersRepository.findUserTokenByUserId(userId);
      if (!userTokens) {
        await this.usersRepository.createNewUserToken({
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

  public async getUserByIdent(ident: string, isSelfUser: boolean): Promise<UserDTO> {
    const filter: { $or: Record<string, string>[] } = {
      $or: [{ username: ident }],
    };
    if (Types.ObjectId.isValid(ident)) {
      filter.$or.push({ _id: ident });
    }
    const user = await this.usersRepository.findUserByFilter(filter);
    if (!user) {
      throw UsersException.UserNotExist();
    }
    return new UserDTO(user, isSelfUser);
  }

  public async patchUser(userId: string, data: PatchUserDTO): Promise<UserDTO> {
    if (!userId) {
      throw UsersException.UserIdNotExist();
    }

    const { avatar, ...patchUserDTO } = data;
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw UsersException.UserIdNotExist();
    }

    if (avatar) {
      const isAvatarValid = this.filesService.validateImage(avatar);
      if (isAvatarValid) {
        this.filesService.writeUserAvatar(userId, avatar);
      }
    } else if (avatar === null) {
      this.filesService.deleteUserAvatar(userId);
    }

    const updatedFields: PatchUserDTO = {};
    const newFields = { ...patchUserDTO };

    for (const i in newFields) {
      if (newFields[i] && user[i] !== newFields[i]) {
        updatedFields[i] = newFields[i];
      }
    }

    await user.updateOne(updatedFields);
    return { ...new UserDTO(user), ...updatedFields };
  }

  public async deleteUser(userId: string): Promise<UserDTO> {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw UsersException.UserIdNotExist();
    }

    await this.usersRepository.deleteUserTokenByUserId(userId);
    await user.deleteOne();

    this.filesService.deleteUserFolder(userId);
    return new UserDTO(user);
  }

  public async findUsersByFilter(filter: Record<string, any>): Promise<UserDTO[]> {
    if (Object.keys(filter).length <= 0) {
      return [];
    }
    return (await this.usersRepository.findUsers(filter)).map((user) => new UserDTO(user));
  }
}
