import { Controller, Get, HttpException, HttpStatus, Param, Query, Res } from '@nestjs/common'
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { ResponseAwardTypeListDto, ResponseAwardTypeDto } from './dto/response-type.dto'
import { SearchAwardTypeDto } from './dto/search-type.dto'
import { ResponseDto } from 'src/common/base/dto/response.dto'
import { AwardTypeService } from './award-type.service'

@ApiTags('type')
@Controller('award-type')
export class AwardTypeController {
  constructor(private readonly awardTypeService: AwardTypeService) {}

  @ApiOkResponse({
    type: ResponseAwardTypeListDto,
    description: 'Get type list',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get type`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get()
  public async all(@Res() res: Response, @Query() searchAwardTypeDto: SearchAwardTypeDto) {
    try {
      searchAwardTypeDto.isEnabled = true
      const { data, total } = await this.awardTypeService.findAllAndPagination(searchAwardTypeDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get type list`,
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
    type: ResponseAwardTypeDto,
    description: 'Get type',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't get type`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get type`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get('/:awardTypeId')
  public async id(@Res() res: Response, @Param('awardTypeId') awardTypeId: string) {
    try {
      const searchAwardTypeDto = new SearchAwardTypeDto()
      searchAwardTypeDto.id = awardTypeId
      searchAwardTypeDto.isEnabled = true
      const { data } = await this.awardTypeService.findById(searchAwardTypeDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get type`,
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
