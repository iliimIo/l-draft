import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  Res,
  HttpException
} from '@nestjs/common'
import { RoundService } from './round.service'
import { CreateRoundDto } from './dto/create-round.dto'
import { UpdateRoundDto } from './dto/update-round.dto'
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger'
import { ResponseDto } from 'src/common/base/dto/response.dto'
import { SearchRoundDto } from './dto/search-round.dto'
import { Response } from 'express'
import { ResponseRoundListDto } from './dto/response-round.dto'

@Controller('round')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @ApiOkResponse({
    type: ResponseRoundListDto,
    description: 'Get round list',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get round list`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get()
  public async all(@Res() res: Response, @Query() searchRoundDto: SearchRoundDto) {
    try {
      searchRoundDto.isEnabled = true
      const { data, total } = await this.roundService.findAllAndPagination(searchRoundDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get round list`,
        data,
        total
      })
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.response.statusCode,
          message: error.response.message
        },
        error.status
      )
    }
  }
}
