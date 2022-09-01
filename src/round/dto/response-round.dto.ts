import { ApiProperty, OmitType } from '@nestjs/swagger'
import { ResponseAndDataDto } from 'src/common/base/dto/response.dto'
import { IsArray } from 'class-validator'

export class RoundDto {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  time: string

  @ApiProperty({ type: Boolean })
  isEnabled: boolean

  @ApiProperty({ type: Boolean })
  isActive: boolean

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}

export class ResponseRoundListDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: () => RoundDto, isArray: true })
  @IsArray()
  data: RoundDto[]

  @ApiProperty()
  total: number
}

export class ResponseRoundDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: RoundDto })
  data: RoundDto
}
