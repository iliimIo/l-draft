import { Module, HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from '../common/passport/jwt.strategy'
import { AuthService } from './auth.service'

@Module({
  imports: [ConfigModule, PassportModule.register({ defaultStrategy: 'jwt' }), HttpModule],
  controllers: [],
  providers: [JwtStrategy, AuthService],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
