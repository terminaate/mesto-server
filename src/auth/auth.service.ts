import { ForbiddenException, Injectable } from '@nestjs/common';
import { RegisterUserDTO } from './dto/register-user.dto';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { UserDTO } from '../users/dto/user.dto';
import { FilesService } from '../files/files.service';
import { RolesService } from '../roles/roles.service';
import { AuthException } from './auth.exception';
import { UsersException } from '../users/users.exception';
import { UsersRepository } from '../users/users.repository';
import { Tokens } from '../users/models/users-tokens.model';

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
    private rolesService: RolesService,
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

    const userTokens = await this.usersService.generateUserTokens(candidate.id, true);
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

    const userRole = await this.rolesService.getRoleByFilter();
    const hashedPassword = await argon2.hash(userDto.password);
    const newUser = await this.usersRepository.createNewUser({
      login: userDto.login,
      username: userDto.login,
      email: userDto.email ?? null,
      password: hashedPassword,
      roles: [userRole.id],
    });
    const userTokens = await this.usersService.generateUserTokens(newUser.id, true);

    this.filesService.createNewUserFolder(newUser.id);

    return { ...userTokens, user: new UserDTO(newUser) };
  }

  public async refresh(refreshToken: string): Promise<Tokens> {
    if (!refreshToken) {
      throw UsersException.UserNotExist();
    }

    const userTokens = await this.usersService.refreshUserTokens(refreshToken);
    if (!userTokens) {
      throw UsersException.UserNotExist();
    }

    return userTokens;
  }

  public async logout(refreshToken: string): Promise<void> {
    const token = await this.usersRepository.findUserTokenByFilter({ refreshToken });
    if (!token) {
      throw new ForbiddenException();
    }
    await token.deleteOne();
  }
}
