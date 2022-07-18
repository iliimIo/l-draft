import { ApiProperty, OmitType } from '@nestjs/swagger'

import { ResponseAndDataDto } from 'src/common/base/dto/response.dto'

export class TypeDto {
  @ApiProperty({ type: String })
  name: string
}

export class AwardDto {
  @ApiProperty({ type: String })
  number: string

  @ApiProperty({ type: String })
  periodDate: string

  @ApiProperty({ type: () => TypeDto })
  type: TypeDto
}

export class GroupsDto {
  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  code: string

  @ApiProperty({ type: String })
  logo: string | null

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
