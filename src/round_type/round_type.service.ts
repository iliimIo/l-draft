import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoundTypeDto } from './dto/create-round_type.dto';
import { SearchRoundTypeDto } from './dto/search-round_type.dto';
import { UpdateRoundTypeDto } from './dto/update-round_type.dto';
import { RoundTypeRepository } from './round_type.repository';

@Injectable()
export class RoundTypeService {
  private readonly logger = new Logger(RoundTypeService.name)
  constructor(
    @InjectRepository(RoundTypeRepository)
    private roundTypeRepository: RoundTypeRepository,
  ) { }


  /**
  * Find all and pagination
  * @param searchRoundTypeDto SearchRoundTypeDto
  */
  public async findAllAndPagination(searchRoundTypeDto: SearchRoundTypeDto) {
    try {
      const [group, total] = await this.roundTypeRepository.getAllAndPagination(searchRoundTypeDto)
      return { data: group, total }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }
}
