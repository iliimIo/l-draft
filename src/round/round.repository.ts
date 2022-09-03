import { InternalServerErrorException, Logger } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { SearchRoundDto } from './dto/search-round.dto'
import { Round } from './entities/round.entity'

@EntityRepository(Round)
export class RoundRepository extends Repository<Round> {
  private logger = new Logger(RoundRepository.name)

  /**
   * Get all and pagination
   * @param searchRoundDto SearchRoundDto
   */
  async getAllAndPagination(searchRoundDto: SearchRoundDto) {
    const { id, name, page, limit, sort, isActive, isEnabled, groupIsEnabled, exchangeIsEnabled } = searchRoundDto
    try {
      const query = this.createQueryBuilder('round')
        .select(['round'])
        .leftJoinAndSelect('round.roundType', 'roundType')
        .leftJoinAndSelect('round.group', 'group')
        .leftJoinAndSelect('group.exchange', 'exchange')
        .leftJoinAndSelect('exchange.type', 'type')

      if (id) {
        query.andWhere('round.id =:id', { id })
      }

      if (name) {
        query.andWhere('round.name =:name', { name })
      }

      if (isEnabled) {
        query.andWhere('round.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('round.isActive =:isActive', { isActive })
      }

      if (groupIsEnabled) {
        query.andWhere('group.isEnabled =:groupIsEnabled', { groupIsEnabled })
      }

      if (exchangeIsEnabled) {
        query.andWhere('exchange.isEnabled =:exchangeIsEnabled', { exchangeIsEnabled })
      }

      return await query
        .offset((Number(page || 1) - 1) * Number(limit || 10))
        .limit(Number(limit || 10))
        .addOrderBy('round.createdAt', sort == 'DESC' ? 'DESC' : 'ASC')
        .getManyAndCount()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }

  /**
   * Get One
   * @param searchRoundDto SearchRoundDto
   */
  async getOne(searchRoundDto: SearchRoundDto) {
    const { id, name, isEnabled, isActive } = searchRoundDto
    try {
      const query = this.createQueryBuilder('round')
        .select(['round'])
        .leftJoinAndSelect('round.roundType', 'roundType')
        .leftJoinAndSelect('round.group', 'group')
        .leftJoinAndSelect('group.exchange', 'exchange')
        .leftJoinAndSelect('exchange.type', 'type')

      if (id) {
        query.andWhere('round.id =:id', { id })
      }

      if (name) {
        query.andWhere('round.name =:name', { name })
      }

      if (isEnabled) {
        query.andWhere('round.isEnabled =:isEnabled', { isEnabled })
      }

      if (isActive) {
        query.andWhere('round.isActive =:isActive', { isActive })
      }

      return await query.getOne()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }
}
