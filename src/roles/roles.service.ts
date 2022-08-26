import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Role, { RoleDocument } from './roles.model';
import { Model } from 'mongoose';
import CreateRoleDto from './dto/create-role.dto';
import CustomHttpException from '../exceptions/custom-http.exception';
import ApiExceptions from '../exceptions/api.exceptions';

@Injectable()
class RolesService {
  constructor(
    @InjectModel(Role.name) private rolesModel: Model<RoleDocument>,
  ) {
  }

  async getRoleByFilter(filter: { [key: string]: string } = { value: 'USER' }) {
    return this.rolesModel.findOne(filter);
  }

  async createRole({ value: newRoleValue }: CreateRoleDto) {
    if (!newRoleValue) {
      throw new CustomHttpException(
        ApiExceptions.RoleValueEmpty(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const candidate = await this.rolesModel.findOne({ value: newRoleValue });
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