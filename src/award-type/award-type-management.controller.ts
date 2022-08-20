import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger/dist/decorators'
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
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'

import { AuthGuard } from '@nestjs/passport'
import RoleGuard from 'src/common/guards/role.guard'
import { Roles } from 'src/common/base/enum/role.enum'
import { AwardTypeService } from './award-type.service'
import { ResponseDto } from 'src/common/base/dto/response.dto'
import { CreateTypeDto } from './dto/create-type.dto'
import { UpdateTypeDto } from './dto/update-type.dto'
import { ResponseAwardTypeDto, ResponseAwardTypeListDto } from './dto/response-type.dto'
import { SearchAwardTypeDto } from './dto/search-type.dto'

@ApiBearerAuth()
@UseGuards(AuthGuard(), RoleGuard([Roles.ADMIN]))
@ApiUnauthorizedResponse({
  description: 'Access token is expire',
  status: HttpStatus.UNAUTHORIZED,
  type: ResponseDto
})
@ApiTags('award-type-management')
@Controller('award-type/management')
export class AwardTypeManagementController {
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
    console.log('all management +++++++')
    try {
      searchAwardTypeDto.isActive = true
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
      searchAwardTypeDto.isActive = true
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
      const { data } = await this.awardTypeService.create(createTypeDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Create award type successfully`,
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
      const { data } = await this.awardTypeService.update(typeId, updateTypeDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Update award type successfully`,
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
    description: 'Enable award type',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't enable award type`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't enable award type`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Patch('enable/:awardTypeId')
  public async enable(@Res() res: Response, @Param('awardTypeId') awardTypeId: string) {
    try {
      const { data } = await this.awardTypeService.enable(awardTypeId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Enable award type successfully`,
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
      await this.awardTypeService.delete(typeId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Delete award type successfully`
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
