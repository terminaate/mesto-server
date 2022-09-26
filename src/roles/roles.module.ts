import { Global, Module } from '@nestjs/common';
import RolesService from './roles.service';
import RolesController from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import Role from './roles.model';
import UserRole from './user-role.model';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Role])],
  providers: [RolesService],
  exports: [RolesService],
  controllers: [RolesController],
})
class RolesModule {
}

export default RolesModule;
