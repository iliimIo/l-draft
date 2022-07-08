import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString } from 'class-validator'

export class CreateTypeDto {
  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  name: string
}
