import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsString } from 'class-validator'

export class CreateExchangeRateDto {
  @ApiProperty({ type: Number, default: 0 })
  @IsNumber()
  @Type(() => Number)
  exchange: number

  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  awardTypeId: string

  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  groupId: string
}
