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
    const { id, name, code, search, page, limit, sort, isDelete } = searchCategoriesDto
    try {
      const query = this.createQueryBuilder('categories').select([
        'categories.id',
        'categories.name',
        'categories.code',
        'categories.isActive',
        'categories.createdAt'
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

      if (Boolean(isDelete)) {
        query.withDeleted()
      } else {
        query.andWhere('categories.isActive =:isActive', { isActive: true })
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
}
