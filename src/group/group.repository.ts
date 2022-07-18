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
    const { id, name, code, categoriesCode, categoriesId, isPublic, search, page, limit, sort, isDelete } =
      searchGroupDto
    try {
      const query = this.createQueryBuilder('group')
        .select(['group'])
        .leftJoin('group.categories', 'categories')
        .where('group.isActive =:isActive', { isActive: true })

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

      if (isPublic) {
        if (isPublic.toString() === 'true') {
          query.andWhere('group.isPublic =:isPublic', { isPublic: true })
        } else {
          query.andWhere('group.isPublic =:isPublic', { isPublic: false })
        }
      }

      if (search) {
        query.andWhere('group.name LIKE :search OR group.code LIKE :search', { search: `%${search}%` })
      }

      if (Boolean(isDelete)) {
        query.withDeleted()
      } else {
        query.andWhere('group.isActive =:isActive', { isActive: true })
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
    const { id, name, code, categoriesCode, categoriesId, isPublic } = searchGroupDto
    try {
      const query = this.createQueryBuilder('group')
        .select(['group'])
        .leftJoin('group.categories', 'categories')
        .where('group.isActive =:isActive', { isActive: true })

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

      if (isPublic) {
        query.andWhere('group.isPublic =:isPublic', { isPublic })
      }

      return await query.getOne()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }
}
