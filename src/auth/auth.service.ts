import { Injectable, Logger, HttpService, HttpException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { map } from 'rxjs/operators'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(private httpService: HttpService, private configService: ConfigService) {}

  /**
   * Find a user by id
   * @param token access token
   */
  async findByUserId(token: string): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
    // try {
    //   return await firstValueFrom(
    //     this.httpService
    //       .get(`${this.configService.get('AUTH_SERVICE')}/auth/profile`, { headers })
    //       .pipe(map((response) => response.data.data))
    //   )
    // } catch (error) {
    //   throw new HttpException(
    //     {
    //       statusCode: error.response.data.statusCode,
    //       message: error.response.data.message
    //     },
    //     error.status
    //   )
    // }
  }

  /**
   * Get user refresh token
   * @param id uuid
   * @param token access token
   */
  async getUserRefreshToken(token: string): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }

    try {
      return await firstValueFrom(
        this.httpService
          .get(`${this.configService.get('AUTH_SERVICE')}/user-refresh-token/verify`, { headers })
          .pipe(map((response) => response.data.data))
      )
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.response.data.statusCode,
          message: error.response.data.message
        },
        error.status
      )
    }
  }
}
