import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RequestWithUserDtoBuilderDto {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  username: string

  @ApiProperty({ type: String })
  phoneNumber: string

  @ApiProperty({ type: String })
  avatar: string

  @ApiProperty({ type: String })
  code: string

  @ApiProperty({ type: String })
  displayName: string

  @ApiProperty()
  isActive: boolean

  @ApiProperty({ type: () => RoleDto })
  role: RoleDto

  @ApiProperty({ type: String })
  token: string
}

export class RoleDto {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string
}

export class RequestWithUserDto {
  @ApiProperty({ type: () => RequestWithUserDtoBuilderDto })
  user: RequestWithUserDtoBuilderDto
}

export class RefreshTokenCookieDto {
  @ApiProperty({ type: String })
  @IsString()
  cookie: string

  @ApiProperty({ type: String })
  @IsString()
  token: string
}
