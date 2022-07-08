import { ApiProperty, OmitType } from '@nestjs/swagger'

import { ResponseAndDataDto } from 'src/common/base/dto/response.dto'
import { IsArray } from 'class-validator'

export class GroupDto {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  code: string

  @ApiProperty({ type: String })
  logo: string

  @ApiProperty({ type: Boolean })
  isPublic: boolean

  @ApiProperty({ type: Boolean })
  isActive: boolean

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}

export class ResponseGroupListDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: () => GroupDto, isArray: true })
  @IsArray()
  data: GroupDto[]

  @ApiProperty()
  total: number
}

export class ResponseGroupDto extends OmitType(ResponseAndDataDto, ['data'] as const) {
  @ApiProperty({ type: GroupDto })
  data: GroupDto
}
