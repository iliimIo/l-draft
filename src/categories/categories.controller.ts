import { Controller, Get, HttpException, HttpStatus, Param, Query, Res } from '@nestjs/common'
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'
import { CategoriesService } from './categories.service'
import { SearchCategoriesDto } from './dto/search-categories.dto'
import { ResponseCategoriesListDto, ResponseCategoriesDto } from './dto/response-categories.dto'
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

  @ApiOkResponse({
    type: ResponseCategoriesDto,
    description: 'Get categories',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't get categories`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get categories`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get('/:categoriesId')
  public async id(@Res() res: Response, @Param('categoriesId') categoriesId: string) {
    try {
      const { data } = await this.categoriesService.findById(categoriesId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get categories`,
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
