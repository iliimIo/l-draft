import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString } from "class-validator";

export class CreateRoundTypeDto {
    @ApiProperty({ type: String })
    @IsString()
    @Type(() => String)
    name: string
}
