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

@ApiBearerAuth()
@UseGuards(AuthGuard(), RoleGuard([ROLE.ADMIN]))
@ApiUnauthorizedResponse({
  description: 'Access token is expire',
  status: HttpStatus.UNAUTHORIZED,
  type: ResponseDto
})
@ApiTags('round-management')
@Controller('round-management')
export class RoundManagementController {
  constructor(private readonly roundService: RoundService) {}
}
