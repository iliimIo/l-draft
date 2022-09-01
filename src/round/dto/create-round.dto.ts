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
  time: string

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  day: string

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  date: string

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
