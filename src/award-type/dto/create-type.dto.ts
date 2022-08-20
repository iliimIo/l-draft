import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsString } from 'class-validator'

export class CreateTypeDto {
  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  name: string

  @ApiProperty({ type: Number })
  @IsNumber()
  @Type(() => Number)
  digit: number
}
