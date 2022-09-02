import { Type } from 'class-transformer'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

import { BaseSearchDto } from 'src/common/base/dto/search.dto'

export class SearchRoundDto extends PickType(BaseSearchDto, [
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
  rewardTime: string

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  groupId: string

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  roundTypeId: string
}
