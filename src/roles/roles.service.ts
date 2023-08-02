import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './models/roles.model';
import { Model } from 'mongoose';
import { CreateRoleDTO } from './dto/create-role.dto';
import { RolesException } from './roles.exception';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private rolesModel: Model<RoleDocument>) {
    void this.init();
  }

  private async init() {
    await this.createInitialRole('ADMIN');
    await this.createInitialRole('USER');
  }

  private async createInitialRole(value: string) {
    const candidate = await this.rolesModel.findOne({ value });
    if (!candidate) {
      await this.rolesModel.create({ value });
    }
  }

  public async getRoleByFilter(filter: { [key: string]: string } = { value: 'USER' }) {
    return this.rolesModel.findOne(filter);
  }

  public async createRole({ value: newRoleValue }: CreateRoleDTO) {
    if (!newRoleValue) {
      throw RolesException.RoleValueEmpty();
    }

    const candidate = await this.rolesModel.findOne({ value: newRoleValue });
    if (candidate) {
      throw RolesException.RoleAlreadyExit();
    }
    return this.rolesModel.create({ value: newRoleValue });
  }
}
