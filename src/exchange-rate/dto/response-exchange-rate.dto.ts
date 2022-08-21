import { ApiProperty, OmitType } from '@nestjs/swagger'

import { ResponseAndDataDto } from 'src/common/base/dto/response.dto'
import { IsArray } from 'class-validator'
import { AwardTypeDto } from 'src/award-type/dto/response-type.dto'
import { GroupDto } from 'src/group/dto/response-group.dto'

export class ExchangeRateDto {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: Number })
  exchange: number

  @ApiProperty({ type: Boolean })
  isEnabled: boolean

  @ApiProperty({ type: Boolean })
  isActive: boolean

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiProperty({ type: () => AwardTypeDto })
  type: AwardTypeDto

  @ApiProperty({ type: () => GroupDto })
  group: GroupDto
}

export class ResponseExchangeRateListDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: () => ExchangeRateDto, isArray: true })
  @IsArray()
  data: ExchangeRateDto[]

  @ApiProperty()
  total: number
}

export class ResponseExchangeRateDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: ExchangeRateDto })
  data: ExchangeRateDto
}
