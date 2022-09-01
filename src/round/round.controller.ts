import { Controller, Get, HttpStatus, Query, Res, HttpException, Param } from '@nestjs/common'
import { RoundService } from './round.service'
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger'
import { ResponseDto } from 'src/common/base/dto/response.dto'
import { SearchRoundDto } from './dto/search-round.dto'
import { Response } from 'express'
import { ResponseRoundListDto, ResponseRoundDto } from './dto/response-round.dto'

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

  @ApiOkResponse({
    type: ResponseRoundDto,
    description: 'Get round',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't get round`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get round`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get('/:roundId')
  public async id(@Res() res: Response, @Param('roundId') roundId: string) {
    try {
      const searchRoundDto = new SearchRoundDto()
      searchRoundDto.id = roundId
      searchRoundDto.isEnabled = true
      searchRoundDto.isActive = true
      const { data } = await this.roundService.findById(searchRoundDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get round`,
        data
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
