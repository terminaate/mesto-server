import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import AuthUserDto from './dto/auth-user.dto';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import UserDto from '../users/dto/user.dto';
import ApiExceptions from '../exceptions/api.exceptions';


@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
  ) {
  }


  async login(ident: string, password: string) {
    const candidate = await this.usersService.findUserByFilter({ $or: [{ email: ident }, { username: ident }] });
    if (!candidate) {
      throw new HttpException(ApiExceptions.UserNotExist(), HttpStatus.BAD_REQUEST);
    }
    const isPasswordMatched = await argon2.verify(candidate.password, password);
    if (!isPasswordMatched) {
      throw new HttpException(ApiExceptions.WrongAuthData(), HttpStatus.BAD_REQUEST);
    }
    const { accessToken, refreshToken } = await this.usersService.findUserTokens(candidate.id);
    return { accessToken, refreshToken, user: new UserDto(candidate) };
  }

  async register(userDto: AuthUserDto) {
    const candidate = await this.usersService.findUserByFilter({ username: userDto.username, email: userDto.email });
    if (candidate) {
      throw new HttpException(ApiExceptions.UserAlreadyExist(), HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await argon2.hash(userDto.password);
    const newUser = await this.usersService.createNewUser({
      username: userDto.username,
      email: userDto.email ?? null,
      bio: userDto.bio ?? null,
      password: hashedPassword,
    });
    const userTokens = await this.usersService.generateUserTokens(newUser.id, true);
    return { ...userTokens, user: new UserDto(newUser) };
  }

  async refresh(refreshToken: string) {
    const userTokens = await this.usersService.refreshUserTokens(refreshToken);
    if (!userTokens) {
      throw new HttpException(ApiExceptions.UserNotExist(), HttpStatus.BAD_REQUEST);
    }
    return userTokens;
  }
}