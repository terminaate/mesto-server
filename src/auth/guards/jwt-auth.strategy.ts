import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import UsersService from '../../users/users.service';
import RolesService from '../../roles/roles.service';

class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(RolesService) private rolesService: RolesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: { id: string }) {
    const user = await this.usersService.findUserByFilter({ _id: payload.id });
    return user;
  }
}

export default JwtStrategy;
