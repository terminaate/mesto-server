import { HttpStatus, Injectable } from '@nestjs/common';
import RegisterUserDto from './dto/register-user.dto';
import UsersService from '../users/users.service';
import * as argon2 from 'argon2';
import UserDto from '../users/dto/user.dto';
import ApiExceptions from '../exceptions/api.exceptions';
import CustomHttpException from '../exceptions/custom-http.exception';

// TODO
// Add data validation

@Injectable()
class AuthService {
  constructor(private usersService: UsersService) {
  }

  async login(ident: string, password: string) {
    const candidate = await this.usersService.findUserByFilter({
      $or: [{ email: ident }, { username: ident }],
    });
    if (!candidate) {
      throw new CustomHttpException(
        ApiExceptions.UserNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    const isPasswordMatched = await argon2.verify(candidate.password, password);
    if (!isPasswordMatched) {
      throw new CustomHttpException(
        ApiExceptions.WrongAuthData(),
        HttpStatus.BAD_REQUEST,
      );
    }
    const userTokens = await this.usersService.generateUserTokens(
      candidate.id,
      true,
    );
    return { ...userTokens, user: new UserDto(candidate) };
  }

  async register(userDto: RegisterUserDto) {
    const candidate = await this.usersService.findUserByFilter({
      login: userDto.login, email: userDto.email,
    });
    if (candidate) {
      console.log('MATCHED');
      throw new CustomHttpException(
        ApiExceptions.UserAlreadyExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await argon2.hash(userDto.password);
    const newUser = await this.usersService.createNewUser({
      login: userDto.login,
      username: userDto.login,
      email: userDto.email ?? null,
      password: hashedPassword,
      roles: ['USER'],
    });
    const userTokens = await this.usersService.generateUserTokens(
      newUser.id,
      true,
    );
    return { ...userTokens, user: new UserDto(newUser) };
  }

  async refresh(refreshToken: string) {
    const userTokens = await this.usersService.refreshUserTokens(refreshToken);
    if (!userTokens) {
      throw new CustomHttpException(
        ApiExceptions.UserNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    return userTokens;
  }
}

export default AuthService;
