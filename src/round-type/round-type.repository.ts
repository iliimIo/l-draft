import { InternalServerErrorException, Logger } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { SearchRoundTypeDto } from './dto/search-round-type.dto'
import { RoundType } from './entities/round-type.entity'

@EntityRepository(RoundType)
export class RoundTypeRepository extends Repository<RoundType> {
  private logger = new Logger(RoundTypeRepository.name)

  /**
   * Get all and pagination
   * @param searchRoundTypeDto SearchRoundTypeDto
   */
  async getAllAndPagination(searchRoundTypeDto: SearchRoundTypeDto) {
    const { id, name, page, limit, sort, isActive, isEnabled } = searchRoundTypeDto
    try {
      const query = this.createQueryBuilder('round_type').select(['name'])

      if (id) {
        query.andWhere('round_type.id =:id', { id })
      }

      if (name) {
        query.andWhere('round_type.name =:name', { name })
      }

      if (isEnabled) {
        query.andWhere('round_type.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('round_type.isActive =:isActive', { isActive })
      }

      return await query
        .offset((Number(page || 1) - 1) * Number(limit || 10))
        .limit(Number(limit || 10))
        .addOrderBy('round_type.createdAt', sort == 'DESC' ? 'DESC' : 'ASC')
        .getManyAndCount()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }

  /**
   * Get One
   * @param searchRoundTypeDto SearchRoundTypeDto
   */
  async getOne(searchRoundTypeDto: SearchRoundTypeDto) {
    const { id, name, isEnabled, isActive } = searchRoundTypeDto
    try {
      const query = this.createQueryBuilder('round_type').select(['name'])

      if (id) {
        query.andWhere('round_type.id =:id', { id })
      }

      if (name) {
        query.andWhere('round_type.name =:name', { name })
      }

      if (isEnabled) {
        query.andWhere('round_type.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('round_type.isActive =:isActive', { isActive })
      }

      return await query.getOne()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }
}
