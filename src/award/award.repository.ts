import { EntityRepository, Repository } from 'typeorm'
import { Award } from './entities/award.entity'
import { SearchAwardDto } from './dto/search-award.dto'
import { InternalServerErrorException, Logger } from '@nestjs/common'

@EntityRepository(Award)
export class AwardRepository extends Repository<Award> {
  private logger = new Logger(AwardRepository.name)

  /**
   * Get all and pagination
   * @param searchAwardDto SearchAwardDto
   */
  async getAllAndPagination(searchAwardDto: SearchAwardDto) {
    const {
      id,
      number,
      periodDate,
      categoriesId,
      categoriesCode,
      groupId,
      groupCode,
      typeId,
      startDate,
      endDate,
      search,
      page,
      limit,
      sort,
      isDelete
    } = searchAwardDto
    try {
      const query = this.createQueryBuilder('award')
        .select([
          'award',
          'categories.id',
          'categories.name',
          'categories.code',
          'group.id',
          'group.name',
          'group.code',
          'group.logo',
          'type.id',
          'type.name'
        ])
        .leftJoin('award.group', 'group')
        .leftJoin('group.categories', 'categories')
        .leftJoin('award.type', 'type')
        .where('award.isActive =:isActive', { isActive: true })

      if (id) {
        query.andWhere('award.id =:id', { id })
      }

      if (number) {
        query.andWhere('award.name =:name', { number })
      }

      if (categoriesId) {
        query.andWhere('categories.id =:groupId', { categoriesId })
      }

      if (categoriesCode) {
        query.andWhere('categories.code =:groupCode', { categoriesCode })
      }

      if (groupId) {
        query.andWhere('group.id =:groupId', { groupId })
      }

      if (groupCode) {
        query.andWhere('group.code =:groupCode', { groupCode })
      }

      if (typeId) {
        query.andWhere('type.id =:typeId', { typeId })
      }

      if (search) {
        query.andWhere('award.number LIKE :search', { search: `%${search}%` })
      }

      if (Boolean(isDelete)) {
        query.withDeleted()
      } else {
        query.andWhere('award.isActive =:isActive', { isActive: true })
      }

      if (periodDate) {
        query.andWhere('award.periodDate BETWEEN :startDate AND :endDate', {
          startDate: new Date(`${periodDate} 00:00:00`),
          endDate: new Date(`${periodDate} 23:59:59`)
        })
      }

      if (startDate && endDate) {
        query.andWhere('award.periodDate BETWEEN :startDate AND :endDate', {
          startDate: new Date(`${startDate} 00:00:00`),
          endDate: new Date(`${endDate} 23:59:59`)
        })
      }

      return await query
        .offset((Number(page || 1) - 1) * Number(limit || 10))
        .limit(Number(limit || 10))
        .addOrderBy('award.periodDate', sort == 'DESC' ? 'DESC' : 'ASC')
        .getManyAndCount()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }

  /**
   * Get One
   * @param searchAwardDto SearchAwardDto
   */
  async getOne(searchAwardDto: SearchAwardDto) {
    const { id, number, periodDate, categoriesId, groupId, typeId, startDate, endDate } = searchAwardDto
    try {
      const query = this.createQueryBuilder('award')
        .select([
          'award',
          'categories.id',
          'categories.name',
          'categories.code',
          'group.id',
          'group.name',
          'group.code',
          'group.logo',
          'type.id',
          'type.name'
        ])
        .leftJoin('award.group', 'group')
        .leftJoin('group.categories', 'categories')
        .leftJoin('award.type', 'type')
        .where('award.isActive =:isActive', { isActive: true })

      if (id) {
        query.andWhere('award.id =:id', { id })
      }

      if (number) {
        query.andWhere('award.number =:number', { number })
      }

      if (categoriesId) {
        query.andWhere('categories.id =:groupId', { categoriesId })
      }

      if (groupId) {
        query.andWhere('group.id =:groupId', { groupId })
      }

      if (typeId) {
        query.andWhere('type.id =:typeId', { typeId })
      }

      if (periodDate && startDate && endDate) {
        query.andWhere('award.periodDate BETWEEN :startDate AND :endDate', {
          startDate: new Date(`${startDate} 00:00:00`),
          endDate: new Date(`${endDate} 23:59:59`)
        })
      }

      return await query.getOne()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }
}
