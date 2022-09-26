import { HttpStatus, Injectable } from '@nestjs/common';
import Role from './roles.model';
import CreateRoleDto from './dto/create-role.dto';
import CustomHttpException from '../exceptions/custom-http.exception';
import ApiExceptions from '../exceptions/api.exceptions';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
class RolesService {
  constructor(@InjectModel(Role) private rolesModel: typeof Role) {
    this.rolesModel.findOne({ where: { value: 'ADMIN' } }).then(r => {
      if (!r) {
        this.rolesModel.create({ value: 'ADMIN' });
      }
    });
    this.rolesModel.findOne({ where: { value: 'USER' } }).then(r => {
      if (!r) {
        this.rolesModel.create({ value: 'USER' });
      }
    });
  }

  async getRoleByFilter(filter: Record<string, any> = { value: 'USER' }) {
    return this.rolesModel.findOne({ where: filter });
  }

  async createRole({ value: newRoleValue }: CreateRoleDto) {
    if (!newRoleValue) {
      throw new CustomHttpException(
        ApiExceptions.RoleValueEmpty(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const candidate = await this.rolesModel.findOne({ where: { value: newRoleValue } });
    if (candidate) {
      throw new CustomHttpException(
        ApiExceptions.RoleAlreadyExit(),
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.rolesModel.create({ value: newRoleValue });
  }
}

export default RolesService;
