import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class JwtPayloadDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
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

  @ApiProperty({ type: String })
  roleName: string

  @ApiProperty({ type: String })
  roleId: string
}
