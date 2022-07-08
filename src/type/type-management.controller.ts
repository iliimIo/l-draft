import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger/dist/decorators'
import { Body, Controller, Delete, HttpException, HttpStatus, Param, Patch, Post, Res, UseGuards } from '@nestjs/common'
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'

import { AuthGuard } from '@nestjs/passport'
import RoleGuard from 'src/common/guards/role.guard'
import { Roles } from 'src/common/base/enum/role.enum'
import { TypeService } from './type.service'
import { ResponseDto } from 'src/common/base/dto/response.dto'
import { CreateTypeDto } from './dto/create-type.dto'
import { UpdateTypeDto } from './dto/update-type.dto'

@ApiBearerAuth()
@UseGuards(AuthGuard(), RoleGuard([Roles.ADMIN]))
@ApiUnauthorizedResponse({
  description: 'Access token is expire',
  status: HttpStatus.UNAUTHORIZED,
  type: ResponseDto
})
@ApiTags('type-management')
@Controller('type/management')
export class TypeManagementController {
  constructor(private readonly typeService: TypeService) {}

  @ApiOkResponse({
    type: ResponseDto,
    description: 'Create type',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't create type`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Post()
  public async create(@Res() res: Response, @Body() createTypeDto: CreateTypeDto) {
    try {
      await this.typeService.create(createTypeDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Create type successfully`
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
    description: 'Update type',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't update type`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't update type`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Patch('/:typeId')
  public async update(@Res() res: Response, @Body() updateTypeDto: UpdateTypeDto, @Param('typeId') typeId: string) {
    try {
      await this.typeService.update(typeId, updateTypeDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Update type successfully`
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
    description: 'Delete type',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't delete type`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't delete type`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Delete('/:typeId')
  public async delete(@Res() res: Response, @Param('typeId') typeId: string) {
    try {
      await this.typeService.delete(typeId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Delete type successfully`
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
