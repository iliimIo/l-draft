import { ApiProperty, OmitType } from '@nestjs/swagger'

import { ResponseAndDataDto } from 'src/common/base/dto/response.dto'
import { IsArray } from 'class-validator'

export class CategoriesDto {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  code: string

  @ApiProperty({ type: Boolean })
  isActive: boolean

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}

export class ResponseCategoriesListDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: () => CategoriesDto, isArray: true })
  @IsArray()
  data: CategoriesDto[]

  @ApiProperty()
  total: number
}

export class ResponseCategoriesDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: CategoriesDto })
  data: CategoriesDto
}
