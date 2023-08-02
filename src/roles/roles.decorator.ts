import { CustomDecorator, SetMetadata } from '@nestjs/common';

export function Roles(...roles): CustomDecorator {
  return SetMetadata('roles', roles);
}
