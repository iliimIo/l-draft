import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common'
import { RequestWithUserDto } from '../base/dto/request-with-user.dto'

const RoleGuard = (roles: string[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUserDto>()
      const user = request.user
      return roles.includes(user?.role?.name)
    }
  }

  return mixin(RoleGuardMixin)
}

export default RoleGuard
