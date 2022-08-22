import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoundTypeService } from './round_type.service';
import { CreateRoundTypeDto } from './dto/create-round_type.dto';
import { UpdateRoundTypeDto } from './dto/update-round_type.dto';

@Controller('round-type')
export class RoundTypeController {
  constructor(private readonly roundTypeService: RoundTypeService) {}


}
