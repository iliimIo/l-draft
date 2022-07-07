import { Controller, Get, HttpException, HttpStatus, Query, Res } from '@nestjs/common'
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'
import { CategoriesService } from './categories.service'
import { SearchCategoriesDto } from './dto/search-categories.dto'
import { ResponseCategoriesListDto } from './dto/response-categories.dto'
import { ResponseDto } from 'src/common/base/dto/response.dto'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOkResponse({
    type: ResponseCategoriesListDto,
    description: 'Get categories list',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get categories`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get()
  public async all(@Res() res: Response, @Query() searchCategoriesDto: SearchCategoriesDto) {
    try {
      const { data, total } = await this.categoriesService.findAllAndPagination(searchCategoriesDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get categories list`,
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
