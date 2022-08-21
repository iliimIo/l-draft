import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { Response } from 'express'
import { ResponseDto } from 'src/common/base/dto/response.dto'
import { ExchangeRateService } from './exchange-rate.service'
import { SearchExchangeRateDto } from './dto/search-exchange-rate.dto'
import { ResponseExchangeRateDto, ResponseExchangeRateListDto } from './dto/response-exchange-rate.dto'
import RoleGuard from 'src/common/guards/role.guard'
import { ROLE } from 'src/common/base/enum/role.enum'
import { AuthGuard } from '@nestjs/passport'
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto'
import { UpdateExchangeRateDto } from './dto/update-exchange-rate.dto'

@ApiBearerAuth()
@UseGuards(AuthGuard(), RoleGuard([ROLE.ADMIN]))
@ApiUnauthorizedResponse({
  description: 'Access token is expire',
  status: HttpStatus.UNAUTHORIZED,
  type: ResponseDto
})
@ApiTags('exchange-rate-management')
@Controller('exchange-rate/management')
export class ExchangeRateManagementController {
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

  @ApiOkResponse({
    type: ResponseDto,
    description: 'Create exchange',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't create exchange`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Post()
  public async create(@Res() res: Response, @Body() createExchangeRateDto: CreateExchangeRateDto) {
    try {
      const { data } = await this.exchangeRateService.create(createExchangeRateDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Create exchange successfully`,
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
    type: ResponseDto,
    description: 'Update exchange',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't update exchange`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't update exchange`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Patch('/:exchangeId')
  public async update(
    @Res() res: Response,
    @Body() updateExchangeRateDto: UpdateExchangeRateDto,
    @Param('exchangeId') exchangeId: string
  ) {
    try {
      const { data } = await this.exchangeRateService.update(exchangeId, updateExchangeRateDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Update exchange successfully`,
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
    type: ResponseDto,
    description: 'Enable exchange',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't enable exchange`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't enable exchange`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Patch('enable/:exchangeId')
  public async enable(@Res() res: Response, @Param('exchangeId') exchangeId: string) {
    try {
      const { data } = await this.exchangeRateService.enable(exchangeId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Enable exchange successfully`,
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
    type: ResponseDto,
    description: 'Delete exchange',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't delete exchange`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't delete exchange`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Delete('/:exchangeId')
  public async delete(@Res() res: Response, @Param('exchangeId') exchangeId: string) {
    try {
      await this.exchangeRateService.delete(exchangeId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Delete exchange successfully`
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
