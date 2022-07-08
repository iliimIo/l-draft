import { Controller, Get, HttpException, HttpStatus, Param, Query, Res } from '@nestjs/common'
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'
import { GroupService } from './group.service'
import { ResponseGroupListDto, ResponseGroupDto } from './dto/response-group.dto'
import { SearchGroupDto } from './dto/search-group.dto'
import { ResponseDto } from 'src/common/base/dto/response.dto'

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

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
  public async all(@Res() res: Response, @Query() searchGroupDto: SearchGroupDto) {
    try {
      const { data, total } = await this.groupService.findAllAndPagination(searchGroupDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get group list`,
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
    type: ResponseGroupDto,
    description: 'Get group',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't get group`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get group`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get('/:groupId')
  public async id(@Res() res: Response, @Param('groupId') groupId: string) {
    try {
      const { data } = await this.groupService.findById(groupId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get group`,
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
