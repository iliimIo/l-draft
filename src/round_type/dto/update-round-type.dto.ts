import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'
import { CreateRoundTypeDto } from './create-round-type.dto'

export class UpdateRoundTypeDto extends PartialType(CreateRoundTypeDto) {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  name: string
}
