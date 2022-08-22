import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString } from 'class-validator'

export class CreateAwardDto {
  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  number: string

  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  rewardDate: string

  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  startDate: string

  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  endDate: string

  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  exchangeId: string
}
