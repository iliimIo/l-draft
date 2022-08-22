import { CreateAwardDto } from './dto/create-award.dto'
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
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { ResponseDto } from 'src/common/base/dto/response.dto'
import RoleGuard from 'src/common/guards/role.guard'
import { ROLE } from 'src/common/base/enum/role.enum'
import { AwardService } from './award.service'
import { ResponseAwardDto, ResponseAwardListDto } from './dto/response-award.dto'
import { UpdateAwardDto } from './dto/update-award.dto'
import { SearchAwardDto } from './dto/search-award.dto'

@ApiBearerAuth()
@UseGuards(AuthGuard(), RoleGuard([ROLE.ADMIN]))
@ApiUnauthorizedResponse({
  description: 'Access token is expire',
  status: HttpStatus.UNAUTHORIZED,
  type: ResponseDto
})
@ApiTags('award-management')
@Controller('award/management')
export class AwardManagementController {
  constructor(private readonly awardService: AwardService) {}

  @ApiOkResponse({
    type: ResponseAwardListDto,
    description: 'Get award list',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get award`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get()
  public async all(@Res() res: Response, @Query() searchAwardDto: SearchAwardDto) {
    try {
      searchAwardDto.isActive = true
      const { data, total } = await this.awardService.findAllAndPagination(searchAwardDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get award list`,
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
    type: ResponseAwardDto,
    description: 'Get award',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't get award`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get award`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Get('/:awardId')
  public async id(@Res() res: Response, @Param('awardId') awardId: string) {
    try {
      const searchAwardDto = new SearchAwardDto()
      searchAwardDto.isActive = true
      searchAwardDto.id = awardId
      const { data } = await this.awardService.findById(searchAwardDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can get award`,
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
    type: ResponseAwardDto,
    description: 'Get award',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't get award`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't get award`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Post()
  public async create(@Res() res: Response, @Body() createAwardDto: CreateAwardDto) {
    try {
      const { data } = await this.awardService.create(createAwardDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Create award successfully`,
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
    description: 'Update award',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't update award`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't update award`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Patch('/:awardId')
  public async update(@Res() res: Response, @Body() updateAwardDto: UpdateAwardDto, @Param('awardId') awardId: string) {
    try {
      const { data } = await this.awardService.update(awardId, updateAwardDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Update award successfully`,
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
    description: 'Enable award',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't enable award`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't enable award`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Patch('enable/:awardId')
  public async enable(@Res() res: Response, @Param('awardId') awardId: string) {
    try {
      const { data } = await this.awardService.enable(awardId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Enable award successfully`,
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
    description: 'Delete award',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't delete award`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't delete award`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Delete('/:award')
  public async delete(@Res() res: Response, @Param('award') award: string) {
    try {
      await this.awardService.delete(award)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Delete award successfully`
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
