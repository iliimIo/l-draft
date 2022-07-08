import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger/dist/decorators'
import { Body, Controller, Delete, HttpException, HttpStatus, Param, Patch, Post, Res, UseGuards } from '@nestjs/common'
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'
import { GroupService } from './group.service'
import { ResponseGroupDto } from './dto/response-group.dto'
import { ResponseDto } from 'src/common/base/dto/response.dto'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { AuthGuard } from '@nestjs/passport'
import RoleGuard from 'src/common/guards/role.guard'
import { Roles } from 'src/common/base/enum/role.enum'

@ApiBearerAuth()
@UseGuards(AuthGuard(), RoleGuard([Roles.ADMIN]))
@ApiUnauthorizedResponse({
  description: 'Access token is expire',
  status: HttpStatus.UNAUTHORIZED,
  type: ResponseDto
})
@ApiTags('group-management')
@Controller('group/management')
export class GroupManagementController {
  constructor(private readonly groupService: GroupService) {}

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
  @Patch('status/:groupId')
  public async status(@Res() res: Response, @Param('groupId') groupId: string) {
    try {
      await this.groupService.status(groupId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Can update group status`
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
    description: 'Create group',
    status: HttpStatus.OK
  })
  @ApiInternalServerErrorResponse({
    description: `Can't create group`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Post()
  public async create(@Res() res: Response, @Body() createGroupDto: CreateGroupDto) {
    try {
      await this.groupService.create(createGroupDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Create group successfully`
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
    description: 'Update group',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't update group`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't update group`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Patch('/:groupId')
  public async update(@Res() res: Response, @Body() updateGroupDto: UpdateGroupDto, @Param('groupId') groupId: string) {
    try {
      await this.groupService.update(groupId, updateGroupDto)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Update group successfully`
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
    description: 'Delete group',
    status: HttpStatus.OK
  })
  @ApiNotFoundResponse({
    type: ResponseDto,
    description: `Can't delete group`,
    status: HttpStatus.NOT_FOUND
  })
  @ApiInternalServerErrorResponse({
    description: `Can't delete group`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ResponseDto
  })
  @Delete('/:groupId')
  public async delete(@Res() res: Response, @Param('groupId') groupId: string) {
    try {
      await this.groupService.delete(groupId)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Delete group successfully`
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
