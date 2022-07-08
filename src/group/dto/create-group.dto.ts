import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class CreateGroupDto {
  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  name: string

  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  code: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  logo: string
}
