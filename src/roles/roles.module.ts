import { Global, Module } from '@nestjs/common';
import RolesService from './roles.service';
import RolesController from './roles.controller';

@Global()
@Module({
  imports: [],
  providers: [RolesService],
  exports: [RolesService],
  controllers: [RolesController],
})
class RolesModule {
}

export default RolesModule;
