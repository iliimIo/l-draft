import { InternalServerErrorException, Logger } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { ExchangeRate } from './entities/exchange-rate.entity'
import { SearchExchangeRateDto } from './dto/search-exchange-rate.dto'

@EntityRepository(ExchangeRate)
export class ExchangeRateRepository extends Repository<ExchangeRate> {
  private logger = new Logger(ExchangeRateRepository.name)

  /**
   * Get all and pagination
   * @param searchAwardTypeDto SearchAwardTypeDto
   */
  async getAllAndPagination(searchExchangeRateDto: SearchExchangeRateDto) {
    const { id, search, awardTypeId, groupId, groupCode, page, limit, sort, isActive, isEnabled } =
      searchExchangeRateDto
    try {
      const query = this.createQueryBuilder('exchange_rate')
        .select(['exchange_rate', 'type', 'group'])
        .leftJoin('exchange_rate.type', 'type')
        .leftJoin('exchange_rate.group', 'group')

      if (id) {
        query.andWhere('exchange_rate.id =:id', { id })
      }

      if (search) {
        query.andWhere('exchange_rate.exchange LIKE :search', {
          search: `%${search}%`
        })
      }

      if (awardTypeId) {
        query.andWhere('type.id =:awardTypeId', { awardTypeId })
      }

      if (groupId) {
        query.andWhere('group.id =:groupId', { groupId })
      }

      if (groupCode) {
        query.andWhere('group.code =:groupCode', { groupCode })
      }

      if (isEnabled) {
        query.andWhere('exchange_rate.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('exchange_rate.isActive =:isActive', { isActive })
      }

      return await query
        .offset((Number(page || 1) - 1) * Number(limit || 10))
        .limit(Number(limit || 10))
        .addOrderBy('exchange_rate.createdAt', sort == 'DESC' ? 'DESC' : 'ASC')
        .getManyAndCount()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }

  /**
   * Get One
   * @param searchExchangeRateDto SearchExchangeRateDto
   */
  async getOne(searchExchangeRateDto: SearchExchangeRateDto) {
    const { id, isEnabled, isActive, groupId, groupCode, awardTypeId } = searchExchangeRateDto
    try {
      const query = this.createQueryBuilder('exchange_rate')
        .select(['exchange_rate', 'type', 'group'])
        .leftJoin('exchange_rate.type', 'type')
        .leftJoin('exchange_rate.group', 'group')

      if (id) {
        query.andWhere('exchange_rate.id =:id', { id })
      }

      if (awardTypeId) {
        query.andWhere('type.id =:awardTypeId', { awardTypeId })
      }

      if (groupId) {
        query.andWhere('group.id =:groupId', { groupId })
      }

      if (groupCode) {
        query.andWhere('group.code =:groupCode', { groupCode })
      }

      if (isEnabled) {
        query.andWhere('exchange_rate.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('exchange_rate.isActive =:isActive', { isActive })
      }

      return await query.getOne()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }
}
