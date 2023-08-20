import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../users/users.repository';
import { IdObject } from '../../common/types/IdObject';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  private async validateAuthData(req): Promise<boolean> {
    const { accessToken } = req.cookies;

    const accessData = await this.jwtService.verifyAsync<IdObject>(accessToken, {
      secret: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration: false,
    });

    const user = await this.usersRepository.findUserById(accessData.id);
    if (user) {
      req.user = user;
    }

    return Boolean(user);
  }

  public canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    return this.validateAuthData(req);
  }
}
