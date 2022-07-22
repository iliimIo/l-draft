import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AwardRepository } from './award.repository'
import { CreateAwardDto } from './dto/create-award.dto'
import { SearchAwardDto } from './dto/search-award.dto'
import { GroupService } from 'src/group/group.service'
import { TypeService } from 'src/type/type.service'
import { Award } from './entities/award.entity'
import { UpdateAwardDto } from './dto/update-award.dto'
import { formatDate } from '../common/utils/date'
import { AwardsDailyDateDto, AwardDto, TypeDto } from 'src/group/dto/response-group-daily.dto'

@Injectable()
export class AwardService {
  private readonly logger = new Logger(AwardService.name)

  constructor(
    @InjectRepository(AwardRepository)
    private awardRepository: AwardRepository,
    @Inject(forwardRef(() => GroupService))
    private groupService: GroupService,
    @Inject(forwardRef(() => TypeService))
    private typeService: TypeService
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
   * Find daily categories award
   */
  public async dailyCategoriesAwards(groupCode: string) {
    try {
      const searchAwardDto = new SearchAwardDto()
      searchAwardDto.groupCode = groupCode
      const typeAwards = await this.awardRepository.getTypeAwards(searchAwardDto)

      const awards = []
      for (const typeAward of typeAwards) {
        const searchAwardAndTypeDto = new SearchAwardDto()
        searchAwardAndTypeDto.typeId = typeAward.type.id
        searchAwardAndTypeDto.groupCode = groupCode
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
      searchAwardDto.groupCode = groupCode
      const total = await this.awardRepository.getDateAwards(searchAwardDto)

      searchAwardDto.page = page
      searchAwardDto.limit = limit
      const dateAwards = await this.awardRepository.getDateAwards(searchAwardDto)

      const awards = []
      for (const dateAward of dateAwards) {
        const searchAwardAndDateDto = new SearchAwardDto()
        searchAwardAndDateDto.periodDate = formatDate(dateAward.award_period_date)
        searchAwardAndDateDto.groupCode = groupCode
        searchAwardAndDateDto.limit = '1000'
        searchAwardAndDateDto.page = '1'

        const awardsDailyDateDto = new AwardsDailyDateDto()
        awardsDailyDateDto.periodDate = dateAward.award_period_date
        awardsDailyDateDto.awards = []

        const [data] = await this.awardRepository.getAllAndPagination(searchAwardAndDateDto)
        for (const award of data) {
          const typeDto = new TypeDto()
          typeDto.name = award.type.name

          const awardDto = new AwardDto()
          awardDto.number = award.number
          awardDto.periodDate = award.periodDate
          awardDto.type = typeDto
          awardsDailyDateDto.awards.push(awardDto)
        }
        awards.push(awardsDailyDateDto)
      }

      return { awards, count: total?.length }
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
   * @param awardId string
   */
  public async findById(awardId: string) {
    try {
      const searchAwardDto = new SearchAwardDto()
      searchAwardDto.id = awardId
      const award = await this.findOne(searchAwardDto)

      if (!award) {
        throw new NotFoundException('Award not found')
      }

      return { data: award }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Create award
   * @param createAwardDto CreateAwardDto
   */
  public async create(createAwardDto: CreateAwardDto) {
    const { number, periodDate, groupId, typeId } = createAwardDto
    try {
      const group = await this.groupService.findById(groupId)
      const type = await this.typeService.findById(typeId)

      const searchAwardPeriodDateDto = new SearchAwardDto()
      searchAwardPeriodDateDto.periodDate = periodDate
      searchAwardPeriodDateDto.groupId = groupId
      const awardPeriodDateNo = await this.awardRepository.getPeriodDateNo(searchAwardPeriodDateDto)

      const searchAwardDto = new SearchAwardDto()
      searchAwardDto.groupId = groupId
      const awardNo = await this.awardRepository.getPeriodDateNo(searchAwardDto)

      const award = new Award()
      award.number = number
      award.periodDate = new Date(periodDate)
      award.group = group.data
      award.type = type.data
      award.no = awardPeriodDateNo ? awardPeriodDateNo.no : awardNo ? awardNo.no + 1 : 1

      return await this.awardRepository.save(award)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Update award
   * @param awardId string
   * @param updateAwardDto UpdateAwardDto
   */
  public async update(awardId: string, updateAwardDto: UpdateAwardDto) {
    const { number, periodDate, groupId, typeId } = updateAwardDto

    try {
      const searchAwardDto = new SearchAwardDto()
      searchAwardDto.id = awardId
      const award = await this.findOne(searchAwardDto)

      if (!award) {
        throw new NotFoundException('Award not found')
      }

      const updateAward = new Award()

      if (groupId) {
        const group = await this.groupService.findById(groupId)
        updateAward.group = group.data
      }

      if (typeId) {
        const type = await this.typeService.findById(typeId)
        updateAward.type = type.data
      }

      if (number) {
        updateAward.number = number
      }

      if (periodDate) {
        updateAward.periodDate = new Date(periodDate)
      }

      return await this.awardRepository.update(award.id, {
        ...updateAward,
        updatedAt: new Date()
      })
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Delete award
   * @param awardId string
   */
  public async delete(awardId: string) {
    try {
      const searchAwardDto = new SearchAwardDto()
      searchAwardDto.id = awardId
      const award = await this.findOne(searchAwardDto)

      if (!award) {
        throw new NotFoundException('Award not found')
      }

      await this.awardRepository.update(award.id, {
        isActive: false,
        deletedAt: new Date()
      })
      return await this.awardRepository.softDelete(award.id)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }
}
