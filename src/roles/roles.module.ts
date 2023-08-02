import { Global, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema, Role } from './models/roles.model';
import { RolesController } from './roles.controller';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  providers: [RolesService],
  exports: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
