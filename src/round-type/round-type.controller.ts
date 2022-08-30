import { Controller, Get, HttpException, HttpStatus, Param, Query, Res } from '@nestjs/common'
import { RoundTypeService } from './round-type.service'
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ResponseDto } from 'src/common/base/dto/response.dto'
import { Response } from 'express'
import { ResponseGroupListDto } from 'src/group/dto/response-group.dto'
import { SearchRoundTypeDto } from './dto/search-round-type.dto'

@ApiTags('round-type')
@Controller('round-type')
export class RoundTypeController {
  constructor(private readonly roundTypeService: RoundTypeService) {}

  @ApiOkResponse({
    type: ResponseGroupListDto,
    description: 'Get group list',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get group list`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get()
  public async all(@Res() res: Response, @Query() searchRoundTypeDto: SearchRoundTypeDto) {
    try {
      searchRoundTypeDto.isEnabled = true
      const { data, total } = await this.roundTypeService.findAllAndPagination(searchRoundTypeDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get round type list`,
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