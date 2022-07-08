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
  periodDate: string

  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  categoriesId: string

  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  typeId: string

  @ApiProperty({ type: String })
  @IsString()
  @Type(() => String)
  groupId: string
}
