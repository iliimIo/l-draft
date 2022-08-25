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
    const { id, name, search, page, limit, sort, isActive, isEnabled } = searchRoundTypeDto
    try {
      const query = this.createQueryBuilder('group').select(['group']).leftJoin('group.categories', 'categories')

      if (id) {
        query.andWhere('group.id =:id', { id })
      }

      if (name) {
        query.andWhere('group.name =:name', { name })
      }

      if (search) {
        query.andWhere('group.name LIKE :search OR group.code LIKE :search', { search: `%${search}%` })
      }

      if (isEnabled) {
        query.andWhere('group.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('group.isActive =:isActive', { isActive })
      }

      return await query
        .offset((Number(page || 1) - 1) * Number(limit || 10))
        .limit(Number(limit || 10))
        .addOrderBy('group.createdAt', sort == 'DESC' ? 'DESC' : 'ASC')
        .getManyAndCount()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }
}
