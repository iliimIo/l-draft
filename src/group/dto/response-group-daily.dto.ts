import { ApiProperty, OmitType } from '@nestjs/swagger'

import { ResponseAndDataDto } from 'src/common/base/dto/response.dto'

export class TypeDto {
  @ApiProperty({ type: String })
  name: string
}

export class AwardDto {
  @ApiProperty({ type: String })
  number: string

  @ApiProperty({ type: Date })
  rewardDate: Date

  @ApiProperty({ type: () => TypeDto })
  type: TypeDto
}

export class AwardsDailyDateDto {
  @ApiProperty({ type: String })
  rewardDate: string | Date

  @ApiProperty({ type: Number })
  no: number

  @ApiProperty({ type: () => TypeDto, isArray: true })
  awards: AwardDto[]
}

export class GroupsDailyDto {
  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  code: string

  @ApiProperty({ type: () => TypeDto, isArray: true })
  awardsDaily: AwardsDailyDateDto[]
}

export class ResponseGroupDailyDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: () => GroupsDailyDto })
  data: GroupsDailyDto

  @ApiProperty()
  total: number
}
