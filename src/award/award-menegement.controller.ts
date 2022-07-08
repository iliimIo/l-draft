import { CreateAwardDto } from './dto/create-award.dto'
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
import { ResponseDto } from 'src/common/base/dto/response.dto'
import RoleGuard from 'src/common/guards/role.guard'
import { Roles } from 'src/common/base/enum/role.enum'
import { AwardService } from './award.service'
import { ResponseAwardDto } from './dto/response-award.dto'
import { UpdateAwardDto } from './dto/update-award.dto'

@ApiBearerAuth()
@UseGuards(AuthGuard(), RoleGuard([Roles.ADMIN]))
@ApiUnauthorizedResponse({
  description: 'Access token is expire',
  status: HttpStatus.UNAUTHORIZED,
  type: ResponseDto
})
@ApiBearerAuth()
@UseGuards(AuthGuard(), RoleGuard([Roles.ADMIN]))
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
  public async status(@Res() res: Response, @Body() createAwardDto: CreateAwardDto) {
    try {
      await this.awardService.create(createAwardDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Create award successfully`
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
      await this.awardService.update(awardId, updateAwardDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Update award successfully`
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
