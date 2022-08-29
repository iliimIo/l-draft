import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { RoundService } from './round.service'
import { CreateRoundDto } from './dto/create-round.dto'
import { UpdateRoundDto } from './dto/update-round.dto'

@Controller('round')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}
}
