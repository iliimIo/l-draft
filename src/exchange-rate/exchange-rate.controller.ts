import { Controller, Get, HttpException, HttpStatus, Param, Query, Res } from '@nestjs/common'
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { ResponseDto } from 'src/common/base/dto/response.dto'
import { ExchangeRateService } from './exchange-rate.service'
import { SearchExchangeRateDto } from './dto/search-exchange-rate.dto'
import { ResponseExchangeRateDto, ResponseExchangeRateListDto } from './dto/response-exchange-rate.dto'

@ApiTags('exchange-rate')
@Controller('exchange-rate')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @ApiOkResponse({
    type: ResponseExchangeRateListDto,
    description: 'Get exchange list',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get exchange list`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get()
  public async all(@Res() res: Response, @Query() searchExchangeRateDto: SearchExchangeRateDto) {
    try {
      searchExchangeRateDto.isEnabled = true
      searchExchangeRateDto.isActive = true
      const { data, total } = await this.exchangeRateService.findAllAndPagination(searchExchangeRateDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get exchange list`,
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
    type: ResponseExchangeRateDto,
    description: 'Get banking',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't get exchange`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get exchange`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get('/:exchangeId')
  public async id(@Res() res: Response, @Param('exchangeId') exchangeId: string) {
    try {
      const searchExchangeRateDto = new SearchExchangeRateDto()
      searchExchangeRateDto.id = exchangeId
      searchExchangeRateDto.isEnabled = true
      searchExchangeRateDto.isActive = true
      const { data } = await this.exchangeRateService.findById(searchExchangeRateDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get exchange`,
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
