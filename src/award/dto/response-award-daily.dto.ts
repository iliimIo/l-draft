import { ApiProperty, OmitType } from '@nestjs/swagger'
import { ResponseAndDataDto } from 'src/common/base/dto/response.dto'

export class TypeDailyDto {
  @ApiProperty({ type: String })
  name: string
}

export class AwardDailyDto {
  @ApiProperty({ type: String })
  number: string

  @ApiProperty({ type: Date })
  periodDate: Date

  @ApiProperty({ type: () => TypeDailyDto })
  type: TypeDailyDto
}

export class GroupDailyDto {
  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  code: string

  @ApiProperty({ type: Date })
  periodDate: Date

  @ApiProperty({ type: () => AwardDailyDto, isArray: true })
  awards: AwardDailyDto[]
}

export class CategoriesDailyDto {
  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: () => GroupDailyDto, isArray: true })
  group: GroupDailyDto[]
}

export class ResponseAwardDailyDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: CategoriesDailyDto, isArray: true })
  data: CategoriesDailyDto[]
}
