import { ApiProperty, OmitType } from '@nestjs/swagger'

import { ResponseAndDataDto } from 'src/common/base/dto/response.dto'

export class TypeDto {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: Number })
  digit: number
}

export class ExchangeDto {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: Number })
  exchange: number
}

export class AwardDto {
  @ApiProperty({ type: String })
  number: string

  @ApiProperty({ type: Date })
  rewardDate: Date

  @ApiProperty({ type: Date })
  startDate: Date

  @ApiProperty({ type: Date })
  endDate: Date

  @ApiProperty({ type: () => TypeDto })
  type: TypeDto

  @ApiProperty({ type: () => ExchangeDto })
  exchange: ExchangeDto
}

export class GroupsDto {
  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  code: string

  @ApiProperty({ type: String })
  logo: string | null

  @ApiProperty({ type: Date })
  rewardDate: Date

  @ApiProperty({ type: () => AwardDto, isArray: true })
  awards: AwardDto[]
}

export class CategoriesDailyDto {
  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  code: string

  @ApiProperty({ type: () => GroupsDto, isArray: true })
  groups: GroupsDto[]
}

export class ResponseCategoriesDailyDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: CategoriesDailyDto })
  data: CategoriesDailyDto
}
