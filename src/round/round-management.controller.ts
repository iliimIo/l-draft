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
import { ResponseDto } from 'src/common/base/dto/response.dto'
import { Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import RoleGuard from 'src/common/guards/role.guard'
import { ROLE } from 'src/common/base/enum/role.enum'
import { RoundService } from './round.service'
import { ResponseRoundListDto } from './dto/response-round.dto'
import { SearchRoundDto } from './dto/search-round.dto'
import { CreateRoundDto } from './dto/create-round.dto'
import { UpdateRoundDto } from './dto/update-round.dto'

@ApiBearerAuth()
// @UseGuards(AuthGuard(), RoleGuard([ROLE.ADMIN]))
@ApiUnauthorizedResponse({
  description: 'Access token is expire',
  status: HttpStatus.UNAUTHORIZED,
  type: ResponseDto
})
@ApiTags('round/management')
@Controller('round/management')
export class RoundManagementController {
  constructor(private readonly roundService: RoundService) {}

  @ApiOkResponse({
    type: ResponseRoundListDto,
    description: 'Get round list',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get round list`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get()
  public async all(@Res() res: Response, @Query() searchRoundDto: SearchRoundDto) {
    try {
      searchRoundDto.isActive = true
      const { data, total } = await this.roundService.findAllAndPagination(searchRoundDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get round list`,
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
    type: ResponseRoundListDto,
    description: 'Get round',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't get round`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get round`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get('/:roundId')
  public async id(@Res() res: Response, @Param('roundId') roundId: string) {
    try {
      const searchRoundDto = new SearchRoundDto()
      searchRoundDto.id = roundId
      searchRoundDto.isActive = true
      const { data } = await this.roundService.findById(searchRoundDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get round`,
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
    description: 'Create round',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't create round`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Post()
  public async create(@Res() res: Response, @Body() createRoundDto: CreateRoundDto) {
    try {
      const { data } = await this.roundService.create(createRoundDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Create round successfully`,
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
    description: 'Update round',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't update round`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't update round type`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Patch('/:roundId')
  public async update(@Res() res: Response, @Body() updateRoundDto: UpdateRoundDto, @Param('roundId') roundId: string) {
    try {
      const { data } = await this.roundService.update(roundId, updateRoundDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Update round successfully`,
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
    description: 'Enable round',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't enable round`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't enable round`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Patch('enable/:roundId')
  public async enable(@Res() res: Response, @Param('roundId') roundId: string) {
    try {
      const { data } = await this.roundService.enable(roundId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Enable round successfully`,
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
    description: 'Delete round',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't delete round`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't delete round`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Delete('/:roundId')
  public async delete(@Res() res: Response, @Param('roundId') roundId: string) {
    try {
      await this.roundService.delete(roundId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Delete round successfully`
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
