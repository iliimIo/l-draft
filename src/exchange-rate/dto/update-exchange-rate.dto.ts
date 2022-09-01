import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateExchangeRateDto {
  @ApiProperty({ type: Number, default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  exchange: number

  @ApiProperty({ type: Number, default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  quantity: number

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  awardTypeId: string

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  groupId: string
}
