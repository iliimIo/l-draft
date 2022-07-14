import { Controller, Get, HttpException, HttpStatus, Param, Query, Res } from '@nestjs/common'
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { ResponseDto } from 'src/common/base/dto/response.dto'

import { AwardService } from './award.service'
import { ResponseAwardListDto, ResponseAwardDto } from './dto/response-award.dto'
import { ResponseAwardDailyDto } from './dto/response-award-daily.dto'
import { SearchAwardDto } from './dto/search-award.dto'

@ApiTags('award')
@Controller('award')
export class AwardController {
  constructor(private readonly awardService: AwardService) {}

  @ApiOkResponse({
    type: ResponseAwardListDto,
    description: 'Get award list',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get award`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get()
  public async all(@Res() res: Response, @Query() searchAwardDto: SearchAwardDto) {
    try {
      const { data, total } = await this.awardService.findAllAndPagination(searchAwardDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get award list`,
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
    type: ResponseAwardDailyDto,
    description: 'Get award daily list',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get award`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get('daily')
  public async daily(@Res() res: Response) {
    try {
      const { data } = await this.awardService.daily()
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get award daily list`,
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

  @ApiOkResponse({
    type: ResponseAwardDto,
    description: 'Get award',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't get award`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get award`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get('/:awardId')
  public async id(@Res() res: Response, @Param('awardId') awardId: string) {
    try {
      const { data } = await this.awardService.findById(awardId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get award`,
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
