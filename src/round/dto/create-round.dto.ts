import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class CreateRoundDto {
  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  name: string

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
  @IsOptional()
  @Type(() => String)
  groupId: string

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  roundTypeId: string
}
