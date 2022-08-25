import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateRoundTypeDto } from './dto/create-round-type.dto'
import { SearchRoundTypeDto } from './dto/search-round-type.dto'
import { UpdateRoundTypeDto } from './dto/update-round-type.dto'
import { RoundTypeRepository } from './round-type.repository'

@Injectable()
export class RoundTypeService {
  private readonly logger = new Logger(RoundTypeService.name)
  constructor(
    @InjectRepository(RoundTypeRepository)
    private roundTypeRepository: RoundTypeRepository
  ) {}

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
