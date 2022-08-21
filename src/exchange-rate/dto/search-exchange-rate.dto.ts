import { Type } from 'class-transformer'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

import { BaseSearchDto } from 'src/common/base/dto/search.dto'

export class SearchExchangeRateDto extends PickType(BaseSearchDto, [
  'page',
  'limit',
  'sort',
  'search',
  'isActive',
  'isEnabled'
]) {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  id: string

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  exchange: number

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  typeName: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  groupName: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  groupCode: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  groupId: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  awardTypeId: string
}
