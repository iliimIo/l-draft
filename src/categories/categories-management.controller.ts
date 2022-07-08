import { Body, Controller, Delete, HttpException, HttpStatus, Param, Patch, Post, Res, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { CategoriesService } from './categories.service'
import { ResponseCategoriesDto } from './dto/response-categories.dto'
import { ResponseDto } from 'src/common/base/dto/response.dto'
import { CreateCategoriesDto } from './dto/create-categories.dto'
import { UpdateCategoriesDto } from './dto/update-categories.dto'
import RoleGuard from 'src/common/guards/role.guard'
import { Roles } from 'src/common/base/enum/role.enum'

@ApiBearerAuth()
@UseGuards(AuthGuard(), RoleGuard([Roles.ADMIN]))
@ApiUnauthorizedResponse({
  description: 'Access token is expire',
  status: HttpStatus.UNAUTHORIZED,
  type: ResponseDto
})
@ApiTags('categories-management')
@Controller('categories/management')
export class CategoriesManagementController {
  constructor(private readonly categoriesService: CategoriesService) {}

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
  @Patch('status/:categoriesId')
  public async status(@Res() res: Response, @Param('categoriesId') categoriesId: string) {
    try {
      await this.categoriesService.status(categoriesId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can update categories status`
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
    description: 'Create categories',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't create categories`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Post()
  public async create(@Res() res: Response, @Body() createCategoriesDto: CreateCategoriesDto) {
    try {
      await this.categoriesService.create(createCategoriesDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Create categories successfully`
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
    description: 'Update categories',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't update categories`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't update categories`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Patch('/:categoriesId')
  public async update(
    @Res() res: Response,
    @Body() updateCategoriesDto: UpdateCategoriesDto,
    @Param('categoriesId') categoriesId: string
  ) {
    try {
      await this.categoriesService.update(categoriesId, updateCategoriesDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Update categories successfully`
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
    description: 'Delete categories',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't delete categories`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't delete categories`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Delete('/:categoriesId')
  public async delete(@Res() res: Response, @Param('categoriesId') categoriesId: string) {
    try {
      await this.categoriesService.delete(categoriesId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Delete categories successfully`
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
