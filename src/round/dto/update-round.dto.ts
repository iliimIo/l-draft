// import { PartialType } from '@nestjs/swagger';
// import { CreateRoundDto } from './create-round.dto';
// export class UpdateRoundDto extends PartialType(CreateRoundDto) {}

import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class UpdateRoundDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  name: string

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
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
