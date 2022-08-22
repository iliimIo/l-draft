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
    const { id, number, rewardDate, startDate, endDate, search, page, limit, sort, isActive, isEnabled } =
      searchAwardDto
    try {
      const query = this.createQueryBuilder('award').select(['award'])

      if (id) {
        query.andWhere('award.id =:id', { id })
      }

      if (number) {
        query.andWhere('award.name =:name', { number })
      }

      if (search) {
        query.andWhere('award.number LIKE :search', { search: `%${search}%` })
      }

      if (rewardDate) {
        query.andWhere('award.rewardDate BETWEEN :startDate AND :endDate', {
          startDate: new Date(`${rewardDate} 00:00:00`),
          endDate: new Date(`${rewardDate} 23:59:59`)
        })
      }

      if (startDate && endDate) {
        query.andWhere('award.rewardDate BETWEEN :startDate AND :endDate', {
          startDate: new Date(`${startDate} 00:00:00`),
          endDate: new Date(`${endDate} 23:59:59`)
        })
      }

      if (isEnabled) {
        query.andWhere('award.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('award.isActive =:isActive', { isActive })
      }

      return await query
        .offset((Number(page || 1) - 1) * Number(limit || 10))
        .limit(Number(limit || 10))
        .addOrderBy('award.rewardDate', sort == 'DESC' ? 'DESC' : 'ASC')
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
    const { id, number, rewardDate, startDate, endDate, search, page, limit, sort, isActive, isEnabled } =
      searchAwardDto
    try {
      const query = this.createQueryBuilder('award').select(['award'])

      if (id) {
        query.andWhere('award.id =:id', { id })
      }

      if (number) {
        query.andWhere('award.number =:number', { number })
      }

      if (rewardDate) {
        query.andWhere('award.rewardDate BETWEEN :startDate AND :endDate', {
          startDate: new Date(`${rewardDate} 00:00:00`),
          endDate: new Date(`${rewardDate} 23:59:59`)
        })
      }

      if (startDate && endDate) {
        query.andWhere('award.rewardDate BETWEEN :startDate AND :endDate', {
          startDate: new Date(`${startDate} 00:00:00`),
          endDate: new Date(`${endDate} 23:59:59`)
        })
      }

      if (isEnabled) {
        query.andWhere('award.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('award.isActive =:isActive', { isActive })
      }

      return await query.getOne()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }

  /**
   * Get type award
   * @param searchAwardDto SearchAwardDto
   */
  async getCategoriesAward(searchAwardDto: SearchAwardDto) {
    const { exchangeId, typeId } = searchAwardDto
    try {
      return this.createQueryBuilder('award')
        .select(['award'])
        .leftJoin('award.exchange', 'exchange')
        .leftJoin('exchange.type', 'type')
        .andWhere('exchange.id =:exchangeId', { exchangeId })
        .andWhere('type.id =:typeId', { typeId })
        .andWhere('award.isEnabled =:isEnabled', { isEnabled: true })
        .andWhere('award.isActive =:isActive', { isActive: true })
        .andWhere('exchange.isEnabled =:isEnabled', { isEnabled: true })
        .andWhere('exchange.isActive =:isActive', { isActive: true })
        .orderBy('award.rewardDate', 'DESC')
        .getOne()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }

  /**
   * Get date award
   * @param searchAwardDto SearchAwardDto
   */
  async getDateAwards(searchAwardDto: SearchAwardDto) {
    // const { groupCode, page, limit } = searchAwardDto
    try {
      const query = await this.createQueryBuilder('award')
        .select(['award.periodDate'])
        .leftJoin('award.group', 'group')
        .where('award.isActive =:isActive', { isActive: true })
        // .andWhere('group.code =:groupCode', { groupCode })
        .distinctOn(['award.periodDate'])

      // if (page) {
      //   query.offset(Number(page) || 1)
      // }

      // if (limit) {
      //   query.limit(Number(limit) || 10)
      // }

      return query.orderBy('award.periodDate', 'DESC').addSelect('award.no').getRawMany()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }

  /**
   * Get award reward date no
   * @param searchAwardDto SearchAwardDto
   */
  async getAwardRewardDateNo(searchAwardDto: SearchAwardDto) {
    const { exchangeId, isActive, isEnabled } = searchAwardDto
    try {
      const query = this.createQueryBuilder('award').select(['award']).leftJoin('award.exchange', 'exchange')

      if (exchangeId) {
        query.andWhere('exchange.id =:exchangeId', { exchangeId })
      }

      if (isEnabled) {
        query.andWhere('award.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('award.isActive =:isActive', { isActive })
      }
      return await query.addOrderBy('award.no', 'DESC').getOne()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }
}
