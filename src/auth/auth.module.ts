import { Module, HttpModule } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from '../common/passport/jwt.strategy'
import { AuthService } from './auth.service'

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: '2592000s' }
      })
    }),
    HttpModule
  ],
  controllers: [],
  providers: [JwtStrategy, AuthService],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
