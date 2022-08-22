import { SearchExchangeRateDto } from './../exchange-rate/dto/search-exchange-rate.dto'
import { ExchangeRateService } from './../exchange-rate/exchange-rate.service'
import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AwardRepository } from './award.repository'
import { CreateAwardDto } from './dto/create-award.dto'
import { SearchAwardDto } from './dto/search-award.dto'
import { GroupService } from 'src/group/group.service'
import { AwardTypeService } from 'src/award-type/award-type.service'
import { Award } from './entities/award.entity'
import { UpdateAwardDto } from './dto/update-award.dto'
import { formatDate } from '../common/utils/date'
import { AwardsDailyDateDto, AwardDto, TypeDto } from 'src/group/dto/response-group-daily.dto'
import { generateNo } from '../common/utils/pagination'
import { MESSAGE } from '../common/message/response'

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
      const exchangeRate = await this.exchangeRateService.findById(searchExchangeRateDto)

      if (!exchangeRate) {
        throw new NotFoundException(MESSAGE.EXCHANGE.NOT_FOUND)
      }

      const searchExchangeRateDateDto = new SearchAwardDto()
      searchExchangeRateDateDto.rewardDate = rewardDate
      searchExchangeRateDateDto.exchangeRateId = exchangeId
      const awardExchangeRateRewardDateNo = await this.awardRepository.getAwardRewardDateNo(searchExchangeRateDateDto)

      const award = new Award()
      award.number = number
      award.rewardDate = new Date(rewardDate)
      award.startDate = new Date(startDate)
      award.endDate = new Date(endDate)
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

      await this.awardRepository.update(award.id, {
        ...updateAwardDto,
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
  public async dailyCategoriesAwards(groupCode: string) {
    try {
      const searchAwardDto = new SearchAwardDto()
      // searchAwardDto.groupCode = groupCode
      const typeAwards = await this.awardRepository.getTypeAwards(searchAwardDto)

      const awards = []
      for (const typeAward of typeAwards) {
        const searchAwardAndTypeDto = new SearchAwardDto()
        // searchAwardAndTypeDto.typeId = typeAward.type.id
        // searchAwardAndTypeDto.groupCode = groupCode
        const award = await this.findOne(searchAwardAndTypeDto)
        awards.push(award)
      }

      return awards
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find daily date award
   */
  public async dailyDateAwards(groupCode: string, page: string, limit: string) {
    try {
      const searchAwardDto = new SearchAwardDto()
      // searchAwardDto.groupCode = groupCode
      const total = await this.awardRepository.getDateAwards(searchAwardDto)

      searchAwardDto.page = page
      searchAwardDto.limit = limit
      const dateAwards = await this.awardRepository.getDateAwards(searchAwardDto)

      const awards = []
      for (const [i, dateAward] of dateAwards.entries()) {
        const { min, max } = generateNo(total?.length, +limit, +page)

        if (i + 1 >= min && i + 1 <= max) {
          const searchAwardAndDateDto = new SearchAwardDto()
          // searchAwardAndDateDto.periodDate = formatDate(dateAward.award_period_date)
          // searchAwardAndDateDto.groupCode = groupCode
          searchAwardAndDateDto.limit = '1000'
          searchAwardAndDateDto.page = '1'

          const awardsDailyDateDto = new AwardsDailyDateDto()
          awardsDailyDateDto.periodDate = dateAward.award_period_date
          awardsDailyDateDto.no = dateAward.award_no
          awardsDailyDateDto.awards = []

          const [data] = await this.awardRepository.getAllAndPagination(searchAwardAndDateDto)
          for (const award of data) {
            const typeDto = new TypeDto()
            // typeDto.name = award.type.name

            const awardDto = new AwardDto()
            awardDto.number = award.number
            // awardDto.periodDate = award.periodDate
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
