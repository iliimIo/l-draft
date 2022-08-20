import { ApiProperty, OmitType } from '@nestjs/swagger'

import { ResponseAndDataDto } from 'src/common/base/dto/response.dto'
import { IsArray } from 'class-validator'

export class AwardTypeDto {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: Boolean })
  isEnabled: boolean

  @ApiProperty({ type: Boolean })
  isActive: boolean

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}

export class ResponseAwardTypeListDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: () => AwardTypeDto, isArray: true })
  @IsArray()
  data: AwardTypeDto[]

  @ApiProperty()
  total: number
}

export class ResponseAwardTypeDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: AwardTypeDto })
  data: AwardTypeDto
}
