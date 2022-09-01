import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import RolesService from './roles.service';

@Injectable()
class RolesGuard implements CanActivate {

  constructor(
    @Inject(RolesService) private readonly rolesService: RolesService,
    private readonly reflector: Reflector,
  ) {
  }

  async canActivate(context: ExecutionContext) {
    const metaRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!metaRoles) {
      return true;
    }
    const roles = await Promise.all(metaRoles.map(async role => (await this.rolesService.getRoleByFilter({ value: role })).id));

    const request = context.switchToHttp().getRequest();
    const { roles: userRoles } = request.user;

    return roles.some(role => userRoles.includes(role));
  }
}

export default RolesGuard;