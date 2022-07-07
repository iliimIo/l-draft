import { ApiProperty, OmitType } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class ResponseAndDataDto<IData> {
  @ApiProperty()
  @IsInt()
  statusCode: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  message?: string

  @ApiProperty()
  data: IData[]
}

export class ResponseDto {
  @ApiProperty()
  @IsInt()
  statusCode: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  message?: string
}