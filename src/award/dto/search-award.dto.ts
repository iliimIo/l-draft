import { Type } from 'class-transformer'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

import { BaseSearchDto } from 'src/common/base/dto/search.dto'

export class SearchAwardDto extends PickType(BaseSearchDto, ['page', 'limit', 'sort', 'search', 'isDelete']) {
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
  periodDate: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  categoriesId: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  categoriesCode: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  groupId: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  groupCode: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  typeId: string

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
}
