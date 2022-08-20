import { InternalServerErrorException, Logger } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { AwardType } from './entities/award-type.entity'
import { SearchTypeDto } from './dto/search-type.dto'

@EntityRepository(AwardType)
export class TypeRepository extends Repository<AwardType> {
  private logger = new Logger(TypeRepository.name)

  /**
   * Get all and pagination
   * @param searchTypeDto SearchTypeDto
   */
  async getAllAndPagination(searchTypeDto: SearchTypeDto) {
    const { id, name, search, page, limit, sort, isDelete } = searchTypeDto
    try {
      const query = this.createQueryBuilder('type')
        .select(['type'])
        .where('type.isActive =:isActive', { isActive: true })

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

      if (Boolean(isDelete)) {
        query.withDeleted()
      } else {
        query.andWhere('type.isActive =:isActive', { isActive: true })
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
   * @param searchTypeDto SearchTypeDto
   */
  async getOne(searchTypeDto: SearchTypeDto) {
    const { id, name } = searchTypeDto
    try {
      const query = this.createQueryBuilder('type')
        .select(['type'])
        .where('type.isActive =:isActive', { isActive: true })

      if (id) {
        query.andWhere('type.id =:id', { id })
      }

      if (name) {
        query.andWhere('type.name =:name', { name })
      }

      return await query.getOne()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }
}
