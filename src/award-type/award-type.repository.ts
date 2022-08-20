import { InternalServerErrorException, Logger } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { AwardType } from './entities/award-type.entity'
import { SearchAwardTypeDto } from './dto/search-type.dto'

@EntityRepository(AwardType)
export class AwardTypeRepository extends Repository<AwardType> {
  private logger = new Logger(AwardTypeRepository.name)

  /**
   * Get all and pagination
   * @param searchAwardTypeDto SearchAwardTypeDto
   */
  async getAllAndPagination(searchAwardTypeDto: SearchAwardTypeDto) {
    const { id, name, search, page, limit, sort, isActive, isEnabled } = searchAwardTypeDto
    try {
      const query = this.createQueryBuilder('type').select(['type'])

      if (id) {
        query.andWhere('type.id =:id', { id })
      }

      if (name) {
        query.andWhere('type.name =:name', { name })
      }

      if (search) {
        query.andWhere('type.name LIKE :search', {
          search: `%${search}%`
        })
      }

      if (isEnabled) {
        query.andWhere('type.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('type.isActive =:isActive', { isActive })
      }

      return await query
        .offset((Number(page || 1) - 1) * Number(limit || 10))
        .limit(Number(limit || 10))
        .addOrderBy('type.createdAt', sort == 'DESC' ? 'DESC' : 'ASC')
        .getManyAndCount()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }

  /**
   * Get One
   * @param searchAwardTypeDto SearchAwardTypeDto
   */
  async getOne(searchAwardTypeDto: SearchAwardTypeDto) {
    const { id, name, isEnabled, isActive } = searchAwardTypeDto
    try {
      const query = this.createQueryBuilder('type').select(['type'])

      if (id) {
        query.andWhere('type.id =:id', { id })
      }

      if (name) {
        query.andWhere('type.name =:name', { name })
      }

      if (isEnabled) {
        query.andWhere('type.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('type.isActive =:isActive', { isActive })
      }

      return await query.getOne()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }

  /**
   * get ids
   * @param ids uuid[]
   */
  async getIds(ids: string[]) {
    try {
      return await this.createQueryBuilder('award_type')
        .select(['award_type'])
        .where('award_type.id IN (:...ids)', { ids })
        .getMany()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }
}
