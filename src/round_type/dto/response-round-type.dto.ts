import { ApiProperty, OmitType } from '@nestjs/swagger'
import { ResponseAndDataDto } from 'src/common/base/dto/response.dto'
import { IsArray } from 'class-validator'

export class RoundTypeDto {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: Boolean })
  isPublic: boolean

  @ApiProperty({ type: Boolean })
  isActive: boolean

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
