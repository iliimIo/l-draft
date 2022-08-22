import { InternalServerErrorException, Logger } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { Categories } from './entities/categories.entity'
import { SearchCategoriesDto } from './dto/search-categories.dto'

@EntityRepository(Categories)
export class CategoriesRepository extends Repository<Categories> {
  private logger = new Logger(CategoriesRepository.name)

  /**
   * Get all and pagination
   * @param searchCategoriesDto SearchCategoriesDto
   */
  async getAllAndPagination(searchCategoriesDto: SearchCategoriesDto) {
    const { id, name, code, search, page, limit, sort, isActive, isEnabled } = searchCategoriesDto
    try {
      const query = this.createQueryBuilder('categories').select([
        'categories.id',
        'categories.name',
        'categories.code',
        'categories.isEnabled',
        'categories.isActive',
        'categories.createdAt',
        'categories.updatedAt',
        'categories.deletedAt'
      ])

      if (id) {
        query.andWhere('categories.id =:id', { id })
      }

      if (name) {
        query.andWhere('categories.name =:name', { name })
      }

      if (code) {
        query.andWhere('categories.code =:code', { code })
      }

      if (search) {
        query.andWhere('categories.name LIKE :search OR categories.code LIKE :search', {
          search: `%${search}%`
        })
      }

      if (isEnabled) {
        query.andWhere('categories.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('categories.isActive =:isActive', { isActive })
      }

      return await query
        .offset((Number(page || 1) - 1) * Number(limit || 10))
        .limit(Number(limit || 10))
        .addOrderBy('categories.createdAt', sort == 'DESC' ? 'DESC' : 'ASC')
        .getManyAndCount()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }

  /**
   * Get One
   * @param searchCategoriesDto SearchCategoriesDto
   */
  async getOne(searchCategoriesDto: SearchCategoriesDto) {
    const { id, name, code, isActive, isEnabled } = searchCategoriesDto
    try {
      const query = this.createQueryBuilder('categories').select(['categories'])
      if (id) {
        query.andWhere('categories.id =:id', { id })
      }

      if (name) {
        query.andWhere('categories.name =:name', { name })
      }

      if (code) {
        query.andWhere('categories.code =:code', { code })
      }

      if (isEnabled) {
        query.andWhere('categories.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('categories.isActive =:isActive', { isActive })
      }

      return await query.getOne()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }

  /**
   * Get categories daily
   */
  async getCategoriesDaily() {
    try {
      const query = this.createQueryBuilder('categories')
        .select([
          'categories.name',
          'categories.code',
          'group.name',
          'group.code',
          'group.logo',
          'exchange.id',
          'exchange.exchange',
          'type.id',
          'type.name',
          'type.digit'
        ])
        .leftJoin('categories.group', 'group')
        .leftJoin('group.exchange', 'exchange')
        .leftJoin('exchange.type', 'type')
        .where('categories.isActive =:isActive', { isActive: true })
        .where('categories.isEnabled =:isEnabled', { isEnabled: true })
        .andWhere('group.isActive =:isActive', { isActive: true })
        .andWhere('group.isEnabled =:isEnabled', { isEnabled: true })

      return await query.addOrderBy('categories.createdAt', 'DESC').getMany()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }
}
