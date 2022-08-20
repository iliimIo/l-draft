import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class BaseSearchDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  page: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  limit: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  sort: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  search: string

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsString()
  isDelete: boolean

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsString()
  isActive: boolean

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsString()
  isEnabled: boolean
}
