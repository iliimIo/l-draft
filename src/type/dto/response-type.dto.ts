import { ApiProperty, OmitType } from '@nestjs/swagger'

import { ResponseAndDataDto } from 'src/common/base/dto/response.dto'
import { IsArray } from 'class-validator'

export class TypeDto {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: Boolean })
  isActive: boolean

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}

export class ResponseTypeListDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: () => TypeDto, isArray: true })
  @IsArray()
  data: TypeDto[]

  @ApiProperty()
  total: number
}

export class ResponseTypeDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: TypeDto })
  data: TypeDto
}
