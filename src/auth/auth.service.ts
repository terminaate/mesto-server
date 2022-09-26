import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import RegisterUserDto from './dto/register-user.dto';
import UsersService from '../users/users.service';
import * as argon2 from 'argon2';
import UserDto from '../users/dto/user.dto';
import ApiExceptions from '../exceptions/api.exceptions';
import CustomHttpException from '../exceptions/custom-http.exception';
import FilesService from '../files/files.service';
import RolesService from '../roles/roles.service';
import { Op } from 'sequelize';

@Injectable()
class AuthService {
  constructor(
    private usersService: UsersService,
    private filesService: FilesService,
    private rolesService: RolesService,
  ) {
  }

  async login(ident: string, password: string) {
    const candidate = await this.usersService.findUserByFilter({
      [Op.or]: [
        { login: ident },
        { email: ident },
      ],
    });
    if (!candidate) {
      throw new CustomHttpException(
        ApiExceptions.WrongAuthData(),
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
      [Op.or]: [
        { login: userDto.login },
        { email: userDto.email },
      ],
    });
    if (candidate) {
      throw new CustomHttpException(
        ApiExceptions.UserAlreadyExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    const userRole = await this.rolesService.getRoleByFilter();
    const hashedPassword = await argon2.hash(userDto.password);
    const newUser = await this.usersService.createNewUser({
      login: userDto.login,
      username: userDto.login,
      email: userDto.email ?? null,
      password: hashedPassword,
      roles: [userRole],
    });
    const userTokens = await this.usersService.generateUserTokens(
      newUser.id,
      true,
    );
    this.filesService.createNewUserFolder(newUser.id);
    return { ...userTokens, user: new UserDto(newUser) };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new CustomHttpException(
        ApiExceptions.UserNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    const userTokens = await this.usersService.refreshUserTokens(refreshToken);
    if (!userTokens) {
      throw new CustomHttpException(
        ApiExceptions.UserNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    return userTokens;
  }

  async logout(refreshToken: string) {
    // LMAO
    // In this method im doing ref tp another service xD
    const token = await this.usersService.findTokenByFilter({ refreshToken });
    if (!token) {
      throw new ForbiddenException();
    }
    await token.destroy();
  }
}

export default AuthService;
