import { ApiProperty, OmitType } from '@nestjs/swagger'

import { ResponseAndDataDto } from 'src/common/base/dto/response.dto'
import { IsArray } from 'class-validator'

export class AwardDto {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  number: string

  @ApiProperty({ type: Date })
  periodDate: Date

  @ApiProperty({ type: Date })
  startDate: Date

  @ApiProperty({ type: Date })
  endDate: Date

  @ApiProperty({ type: Boolean })
  isAward: boolean

  @ApiProperty({ type: Boolean })
  isEnabled: boolean

  @ApiProperty({ type: Boolean })
  isActive: boolean

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}

export class ResponseAwardListDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: () => AwardDto, isArray: true })
  @IsArray()
  data: AwardDto[]

  @ApiProperty()
  total: number
}

export class ResponseAwardDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: AwardDto })
  data: AwardDto
}
