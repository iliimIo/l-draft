import { SearchExchangeRateDto } from './../exchange-rate/dto/search-exchange-rate.dto'
import { ExchangeRateService } from './../exchange-rate/exchange-rate.service'
import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AwardRepository } from './award.repository'
import { CreateAwardDto } from './dto/create-award.dto'
import { SearchAwardDto } from './dto/search-award.dto'
import { Award } from './entities/award.entity'
import { UpdateAwardDto } from './dto/update-award.dto'
import { formatDate } from '../common/utils/date'
import { AwardsDailyDateDto, AwardDto, TypeDto } from 'src/group/dto/response-group-daily.dto'
import { generateNo } from '../common/utils/pagination'
import { MESSAGE } from '../common/message/response'
import { changeTimeZone } from '../common/utils/date'

@Injectable()
export class AwardService {
  private readonly logger = new Logger(AwardService.name)

  constructor(
    @InjectRepository(AwardRepository)
    private awardRepository: AwardRepository,
    @Inject(forwardRef(() => ExchangeRateService))
    private exchangeRateService: ExchangeRateService
  ) {}

  /**
   * Find all and pagination
   * @param searchAwardDto SearchAwardDto
   */
  public async findAllAndPagination(searchAwardDto: SearchAwardDto) {
    try {
      const [award, total] = await this.awardRepository.getAllAndPagination(searchAwardDto)
      return { data: award, total }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find one
   * @param searchAwardDto SearchAwardDto
   */
  public async findOne(searchAwardDto: SearchAwardDto) {
    try {
      return await this.awardRepository.getOne(searchAwardDto)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find by id
   * @param searchAwardDto SearchAwardDto
   */
  public async findById(searchAwardDto: SearchAwardDto) {
    try {
      const award = await this.findOne(searchAwardDto)

      if (!award) {
        throw new NotFoundException(MESSAGE.AWARD.NOT_FOUND)
      }

      return { data: award }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Create
   * @param createAwardDto CreateAwardDto
   */
  public async create(createAwardDto: CreateAwardDto) {
    const { number, rewardDate, startDate, endDate, exchangeId } = createAwardDto
    try {
      const searchExchangeRateDto = new SearchExchangeRateDto()
      searchExchangeRateDto.id = exchangeId
      searchExchangeRateDto.isActive = true
      searchExchangeRateDto.isEnabled = true
      const exchangeRate = await this.exchangeRateService.findById(searchExchangeRateDto)

      if (!exchangeRate) {
        throw new NotFoundException(MESSAGE.EXCHANGE.NOT_FOUND)
      }

      const searchExchangeRateDateDto = new SearchAwardDto()
      searchExchangeRateDateDto.rewardDate = rewardDate
      searchExchangeRateDateDto.exchangeId = exchangeId
      const awardExchangeRateRewardDateNo = await this.awardRepository.getAwardRewardDateNo(searchExchangeRateDateDto)

      const award = new Award()
      award.number = number
      award.rewardDate = new Date(changeTimeZone(rewardDate, 'UTC'))
      award.startDate = new Date(changeTimeZone(startDate, 'UTC'))
      award.endDate = new Date(changeTimeZone(endDate, 'UTC'))
      award.exchange = exchangeRate.data
      award.no = awardExchangeRateRewardDateNo?.no + 1 || 1

      const data = await this.awardRepository.save(award)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Update
   * @param awardId string
   * @param updateAwardDto UpdateAwardDto
   */
  public async update(awardId: string, updateAwardDto: UpdateAwardDto) {
    try {
      const searchAwardDto = new SearchAwardDto()
      searchAwardDto.id = awardId
      searchAwardDto.isActive = true
      const award = await this.findOne(searchAwardDto)

      if (!award) {
        throw new NotFoundException(MESSAGE.AWARD.NOT_FOUND)
      }

      if (new Date(new Date(`${award.rewardDate}`).getTime()) > new Date() && updateAwardDto.number !== award.number) {
        throw new NotFoundException(MESSAGE.AWARD.NOT_REWARD)
      }

      await this.awardRepository.update(award.id, {
        ...updateAwardDto,
        isAward: updateAwardDto.number !== award.number ? true : false,
        updatedAt: new Date()
      })
      return await this.findById(searchAwardDto)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Enable
   * @param awardId uuid
   */
  public async enable(awardId: string) {
    try {
      const searchAwardDto = new SearchAwardDto()
      searchAwardDto.id = awardId
      searchAwardDto.isActive = true

      const award = await this.findOne(searchAwardDto)
      if (!award) {
        throw new NotFoundException(MESSAGE.AWARD.NOT_FOUND)
      }

      await this.awardRepository.update(award.id, {
        isEnabled: !award.isEnabled,
        updatedAt: new Date()
      })
      const data = await this.awardRepository.findOne(award.id)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Delete
   * @param awardId string
   */
  public async delete(awardId: string) {
    try {
      const searchAwardDto = new SearchAwardDto()
      searchAwardDto.id = awardId
      const award = await this.findOne(searchAwardDto)

      if (!award) {
        throw new NotFoundException(MESSAGE.AWARD.NOT_FOUND)
      }

      await this.awardRepository.update(award.id, {
        isActive: false,
        updatedAt: new Date()
      })
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find daily categories award
   */
  public async dailyCategoriesAwards(exchangeId: string, typeId: string) {
    try {
      const searchAwardDto = new SearchAwardDto()
      searchAwardDto.exchangeId = exchangeId
      searchAwardDto.typeId = typeId
      return await this.awardRepository.getCategoriesAward(searchAwardDto)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find daily group award
   */
  public async dailyGroupAwards(groupCode: string, page: string, limit: string) {
    try {
      const searchAwardDto = new SearchAwardDto()
      searchAwardDto.groupCode = groupCode
      const total = await this.awardRepository.getGroupAward(searchAwardDto)
      const dateAwards = await this.awardRepository.getGroupAward(searchAwardDto)

      const awards = []
      for (const [i, dateAward] of dateAwards.entries()) {
        const { min, max } = generateNo(total?.length, +limit, +page)

        if (i + 1 >= min && i + 1 <= max) {
          const searchAwardAndDateDto = new SearchAwardDto()
          searchAwardAndDateDto.rewardDate = formatDate(dateAward.award_reward_date)
          searchAwardAndDateDto.groupCode = groupCode
          searchAwardAndDateDto.limit = '1000'
          searchAwardAndDateDto.page = '1'
          searchAwardAndDateDto.isExchange = true

          const awardsDailyDateDto = new AwardsDailyDateDto()
          awardsDailyDateDto.rewardDate = dateAward.award_reward_date
          awardsDailyDateDto.no = dateAward.award_no
          awardsDailyDateDto.awards = []

          const [data] = await this.awardRepository.getAllAndPagination(searchAwardAndDateDto)
          for (const award of data) {
            const typeDto = new TypeDto()
            typeDto.name = award.exchange.type.name

            const awardDto = new AwardDto()
            awardDto.number = award.number
            awardDto.rewardDate = award.rewardDate
            awardDto.type = typeDto
            awardsDailyDateDto.awards.push(awardDto)
          }
          awards.push(awardsDailyDateDto)
        }
      }

      return { awards, count: total?.length }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }
}
