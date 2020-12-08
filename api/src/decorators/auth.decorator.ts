import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { UserRoles } from '../models/user-model/user.enums';
import { AuthRequiredGuard } from '../guards/auth-required.guard';
import { RestrictToGuard } from '../guards/restrict-to.guard';

type AuthOptions = {
  roles?: UserRoles[];
};
/**
 * @description Korunan endpointler için kullanılan decorator.
 * AuthRequiredGuard ekler ve roles parametresi verilmişse rolü kontrol eder.
 */
export const Auth = (options?: AuthOptions) => {
  const decorators = [
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: 'Forbidden.' }),
  ];

  const guards: [typeof AuthRequiredGuard | typeof RestrictToGuard] = [
    AuthRequiredGuard,
  ];

  if (options?.roles?.length > 0) {
    decorators.push(SetMetadata('roles', options.roles));

    guards.push(RestrictToGuard);
  }

  decorators.push(UseGuards(...guards));

  return applyDecorators(...decorators);
};
