import { InternalServerErrorException, Logger } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { Group } from './entities/group.entity'
import { SearchGroupDto } from './dto/search-group.dto'

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
  private logger = new Logger(GroupRepository.name)

  /**
   * Get all and pagination
   * @param searchGroupDto SearchGroupDto
   */
  async getAllAndPagination(searchGroupDto: SearchGroupDto) {
    const { id, name, code, categoriesCode, categoriesId, search, page, limit, sort, isActive, isEnabled } =
      searchGroupDto
    try {
      const query = this.createQueryBuilder('group').select(['group']).leftJoin('group.categories', 'categories')

      if (id) {
        query.andWhere('group.id =:id', { id })
      }

      if (name) {
        query.andWhere('group.name =:name', { name })
      }

      if (code) {
        query.andWhere('group.code =:code', { code })
      }

      if (categoriesCode) {
        query.andWhere('categories.code =:categoriesCode', { categoriesCode })
      }

      if (categoriesId) {
        query.andWhere('categories.id =:categoriesId', { categoriesId })
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

  /**
   * Get One
   * @param searchGroupDto
   */
  async getOne(searchGroupDto: SearchGroupDto) {
    const { id, name, code, categoriesCode, categoriesId, isActive, isEnabled, isExchange } = searchGroupDto
    try {
      const query = this.createQueryBuilder('group').select(['group']).leftJoin('group.categories', 'categories')

      if (id) {
        query.andWhere('group.id =:id', { id })
      }

      if (name) {
        query.andWhere('group.name =:name', { name })
      }

      if (code) {
        query.andWhere('group.code =:code', { code })
      }

      if (isExchange) {
        query
          .leftJoinAndSelect('group.exchange', 'exchange')
          .leftJoinAndSelect('exchange.type', 'type')
          .andWhere('type.isActive =:isActive', { isEnabled: true })
          .andWhere('type.isEnabled =:isEnabled', { isEnabled: true })
          .andWhere('exchange.isActive =:isActive', { isEnabled: true })
          .andWhere('exchange.isEnabled =:isEnabled', { isEnabled: true })
      }

      if (categoriesCode) {
        query.andWhere('categories.code =:categoriesCode', { categoriesCode })
      }

      if (categoriesId) {
        query.andWhere('categories.id =:categoriesId', { categoriesId })
      }

      if (isEnabled) {
        query.andWhere('group.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('group.isActive =:isActive', { isActive })
      }

      return await query.getOne()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }
}
