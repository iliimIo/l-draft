import { Type } from 'class-transformer'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

import { BaseSearchDto } from 'src/common/base/dto/search.dto'

export class SearchAwardDto extends PickType(BaseSearchDto, [
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

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  number: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  rewardDate: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  startDate: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  endDate: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  exchangeId: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  typeId: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  groupCode: string

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @Type(() => Boolean)
  isExchange: boolean
}
