import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from './roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(RolesService) private readonly rolesService: RolesService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const metaRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!metaRoles) {
      return true;
    }
    const roles = await Promise.all(metaRoles.map(async (role) => (await this.rolesService.getRoleByFilter({ value: role })).id));

    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      return true;
    }
    const { roles: userRoles } = request.user;

    return roles.some((role) => userRoles.includes(role));
  }
}
