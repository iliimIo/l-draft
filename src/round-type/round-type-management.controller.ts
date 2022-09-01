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
import { RoundTypeService } from './round-type.service'
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { ResponseDto } from 'src/common/base/dto/response.dto'
import { Response } from 'express'
import { SearchRoundTypeDto } from './dto/search-round-type.dto'
import { AuthGuard } from '@nestjs/passport'
import RoleGuard from 'src/common/guards/role.guard'
import { ROLE } from 'src/common/base/enum/role.enum'
import { ResponseRoundTypeListDto } from './dto/response-round-type.dto'
import { CreateRoundTypeDto } from './dto/create-round-type.dto'
import { UpdateRoundTypeDto } from './dto/update-round-type.dto'

@ApiBearerAuth()
@UseGuards(AuthGuard(), RoleGuard([ROLE.ADMIN]))
@ApiUnauthorizedResponse({
  description: 'Access token is expire',
  status: HttpStatus.UNAUTHORIZED,
  type: ResponseDto
})
@ApiTags('round-type-management')
@Controller('round-type/management')
export class RoundTypeManagementController {
  constructor(private readonly roundTypeService: RoundTypeService) {}

  @ApiOkResponse({
    type: ResponseRoundTypeListDto,
    description: 'Get round type list',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get round type list`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get()
  public async all(@Res() res: Response, @Query() searchRoundTypeDto: SearchRoundTypeDto) {
    try {
      searchRoundTypeDto.isActive = true
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

  @ApiOkResponse({
    type: ResponseRoundTypeListDto,
    description: 'Get round type',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't get round type`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get round type`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get('/:roundTypeId')
  public async id(@Res() res: Response, @Param('roundTypeId') roundTypeId: string) {
    try {
      const searchRoundTypeDto = new SearchRoundTypeDto()
      searchRoundTypeDto.id = roundTypeId
      searchRoundTypeDto.isActive = true
      const { data } = await this.roundTypeService.findById(searchRoundTypeDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get round type`,
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
    description: 'Create round type',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't create round type`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Post()
  public async create(@Res() res: Response, @Body() createRoundTypeDto: CreateRoundTypeDto) {
    try {
      const { data } = await this.roundTypeService.create(createRoundTypeDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Create round type successfully`,
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
    description: 'Update round type',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't update round type`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't update round type`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Patch('/:roundTypeId')
  public async update(
    @Res() res: Response,
    @Body() updateRoundTypeDto: UpdateRoundTypeDto,
    @Param('roundTypeId') roundTypeId: string
  ) {
    try {
      console.log(roundTypeId)
      const { data } = await this.roundTypeService.update(roundTypeId, updateRoundTypeDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Update round type successfully`,
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
    description: 'Enable round type',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't enable round type`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't enable round type`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Patch('enable/:roundTypeId')
  public async enable(@Res() res: Response, @Param('roundTypeId') roundTypeId: string) {
    try {
      const { data } = await this.roundTypeService.enable(roundTypeId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Enable round type successfully`,
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
    description: 'Delete round type',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't delete round type`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't delete round type`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Delete('/:roundTypeId')
  public async delete(@Res() res: Response, @Param('roundTypeId') roundTypeId: string) {
    try {
      await this.roundTypeService.delete(roundTypeId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Delete round type successfully`
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
