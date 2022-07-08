import { Type } from 'class-transformer'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

import { BaseSearchDto } from 'src/common/base/dto/search.dto'

export class SearchCategoriesDto extends PickType(BaseSearchDto, ['page', 'limit', 'sort', 'search', 'isDelete']) {
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

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPublic: boolean
}
