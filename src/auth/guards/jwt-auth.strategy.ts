import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import { RolesService } from '../../roles/roles.service';
import { UserDocument } from '../../users/models/users.model';
import { UsersRepository } from '../../users/users.repository';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsersRepository) private usersRepository: UsersRepository,
    @Inject(RolesService) private rolesService: RolesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  public async validate(payload: { id: string }): Promise<UserDocument> {
    const user = await this.usersRepository.findUserById(payload.id);
    user.roles = await Promise.all(user.roles.map(async (role) => (await this.rolesService.getRoleByFilter({ _id: role })).value));
    return user;
  }
}
