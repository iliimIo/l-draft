import { Type } from 'class-transformer'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

import { BaseSearchDto } from 'src/common/base/dto/search.dto'

export class SearchGroupDto extends PickType(BaseSearchDto, [
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
  name: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  code: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  categoriesCode: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  categoriesId: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  awardTypeId: string

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsString()
  isExchange: boolean
}
