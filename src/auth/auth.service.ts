import { ForbiddenException, Injectable } from '@nestjs/common';
import { RegisterUserDTO } from './dto/register-user.dto';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { UserDTO } from '../users/dto/user.dto';
import { FilesService } from '../files/files.service';
import { AuthException } from './auth.exception';
import { UsersException } from '../users/users.exception';
import { UsersRepository } from '../users/users.repository';
import { Tokens } from '../users/models/user-token.model';
import { JwtService } from '@nestjs/jwt';

type AuthFunctionsReturnType = {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private usersRepository: UsersRepository,
    private filesService: FilesService,
    private jwtService: JwtService,
  ) {}

  public async login(ident: string, password: string): Promise<AuthFunctionsReturnType> {
    const candidate = await this.usersRepository.findUserByFilter({
      $or: [{ email: ident }, { login: ident }],
    });
    if (!candidate) {
      throw AuthException.WrongAuthData();
    }

    const isPasswordMatched = await argon2.verify(candidate.password, password);
    if (!isPasswordMatched) {
      throw AuthException.WrongAuthData();
    }

    const userTokens = await this.generateUserTokens(candidate.id, true);
    return { ...userTokens, user: new UserDTO(candidate) };
  }

  public async register(userDto: RegisterUserDTO): Promise<AuthFunctionsReturnType> {
    const candidate = await this.usersRepository.findUserByFilter({
      login: userDto.login,
      email: userDto.email,
    });
    if (candidate) {
      throw UsersException.UserAlreadyExist();
    }

    const hashedPassword = await argon2.hash(userDto.password);
    const newUser = await this.usersRepository.createNewUser({
      login: userDto.login,
      username: userDto.login,
      email: userDto.email ?? null,
      password: hashedPassword,
    });
    const userTokens = await this.generateUserTokens(newUser.id, true);

    this.filesService.createNewUserFolder(newUser.id);

    return { ...userTokens, user: new UserDTO(newUser) };
  }

  public async refresh(refreshToken: string, accessToken: string): Promise<Tokens> {
    if (!refreshToken || !accessToken) {
      throw UsersException.UserNotExist();
    }

    const userTokens = await this.refreshUserTokens(refreshToken, accessToken);
    if (!userTokens) {
      throw UsersException.UserNotExist();
    }

    return userTokens;
  }

  public async logout(refreshToken: string, accessToken: string): Promise<void> {
    const token = await this.usersRepository.findUserTokenByFilter({ $or: [{ accessToken }, { refreshToken }] });
    if (!token) {
      throw new ForbiddenException();
    }

    await token.deleteOne();
  }

  private async refreshUserTokens(refreshToken: string, accessToken: string): Promise<Tokens> {
    const userTokens = await this.usersRepository.findUserTokenByFilter({ $or: [{ accessToken }, { refreshToken }] });
    if (!userTokens) {
      return null;
    }

    return this.generateUserTokens(userTokens.userId, true);
  }

  private async generateUserTokens(userId: string, save = false): Promise<Tokens> {
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

    if (!save) {
      return { accessToken, refreshToken };
    }

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

    return { accessToken, refreshToken };
  }
}
