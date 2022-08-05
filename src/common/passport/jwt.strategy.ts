import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from 'src/auth/auth.service'

import { JwtPayloadDto } from '../base/dto/jwt-payload.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      passReqToCallback: true
    })
  }

  async validate(req: Request, payload: JwtPayloadDto) {
    const authorization = req.headers.authorization

    const [, token] = authorization.split(' ')
    if (!token) {
      throw new UnauthorizedException()
    }
    const user = await this.authService.findByUserId(token)

    if (!user) {
      throw new UnauthorizedException()
    }
    user.token = token
    return user
  }
}
