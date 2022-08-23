import { UpdateAwardDto } from './../award/dto/update-award.dto'
import { ConflictException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoriesRepository } from './categories.repository'
import { SearchCategoriesDto } from './dto/search-categories.dto'
import { CreateCategoriesDto } from './dto/create-categories.dto'
import { UpdateCategoriesDto } from './dto/update-categories.dto'
import { AwardService } from 'src/award/award.service'
import { CategoriesDailyDto, GroupsDto, AwardDto, TypeDto, ExchangeDto } from './dto/response-categories-daily.dto'
import { MESSAGE } from '../common/message/response'

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name)

  constructor(
    @InjectRepository(CategoriesRepository)
    private categoriesRepository: CategoriesRepository,
    @Inject(forwardRef(() => AwardService))
    private awardService: AwardService
  ) {}

  /**
   * Find daily award
   */
  public async dailyAwards() {
    try {
      const categoriesDaily = await this.categoriesRepository.getCategoriesDaily()

      const data: any = []
      for (const cat of categoriesDaily) {
        const categoriesDto = new CategoriesDailyDto()
        categoriesDto.name = cat.name
        categoriesDto.code = cat.code
        categoriesDto.groups = []

        for (const group of cat.group) {
          const groupDto = new GroupsDto()
          groupDto.name = group.name
          groupDto.code = group.code
          groupDto.logo = group.logo
          groupDto.rewardDate = new Date()
          groupDto.awards = []

          for (const exchange of JSON.parse(JSON.stringify(group.exchange))) {
            const typeDto = new TypeDto()
            typeDto.id = exchange.type.id
            typeDto.name = exchange.type.name
            typeDto.digit = exchange.type.digit

            const exchangeDto = new ExchangeDto()
            exchangeDto.id = exchange.id
            exchangeDto.exchange = exchange.exchange

            const award = await this.awardService.dailyCategoriesAwards(exchange.id, exchange.type.id)
            if (award) {
              groupDto.rewardDate = award.rewardDate

              const awardDto = new AwardDto()
              awardDto.number = award.number
              awardDto.rewardDate = award.rewardDate
              awardDto.startDate = award.startDate
              awardDto.endDate = award.endDate
              awardDto.type = typeDto
              awardDto.exchange = exchangeDto
              await groupDto.awards.push(awardDto)
            }
          }
          categoriesDto.groups.push(groupDto)
        }
        data.push(categoriesDto)
      }
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find all and pagination
   * @param searchCategoriesDto SearchCategoriesDto
   */
  public async findAllAndPagination(searchCategoriesDto: SearchCategoriesDto) {
    try {
      const [categories, total] = await this.categoriesRepository.getAllAndPagination(searchCategoriesDto)
      return { data: categories, total }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find one
   * @param searchCategoriesDto SearchCategoriesDto
   */
  public async findOne(searchCategoriesDto: SearchCategoriesDto) {
    try {
      return await this.categoriesRepository.getOne(searchCategoriesDto)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find by id
   * @param searchCategoriesDto SearchCategoriesDto
   */
  public async findById(searchCategoriesDto: SearchCategoriesDto) {
    try {
      const categories = await this.findOne(searchCategoriesDto)

      if (!categories) {
        throw new NotFoundException(MESSAGE.CATEGORY.NOT_FOUND)
      }

      return { data: categories }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Create
   * @param createBankingDto CreateBankingDto
   */
  public async create(createCategoriesDto: CreateCategoriesDto) {
    try {
      const searchCategoriesDto = new SearchCategoriesDto()
      searchCategoriesDto.name = createCategoriesDto.name

      const categories = await this.findOne(searchCategoriesDto)

      if (categories && !categories?.isActive) {
        await this.categoriesRepository.update(categories.id, {
          isActive: true,
          updatedAt: new Date()
        })
        const data = await this.categoriesRepository.findOne(categories.id)
        return { data }
      }

      if (categories) {
        throw new ConflictException(MESSAGE.CATEGORY.DUPLICATE_NAME)
      }

      const searchCategoriesCodeDto = new SearchCategoriesDto()
      searchCategoriesCodeDto.code = createCategoriesDto.code

      const categoriesCode = await this.findOne(searchCategoriesCodeDto)
      if (categoriesCode) {
        throw new ConflictException(MESSAGE.CATEGORY.DUPLICATE_CODE)
      }

      const data = await this.categoriesRepository.save(createCategoriesDto)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Update
   * @param categoriesId uuid
   * @param updateCategoriesDto UpdateCategoriesDto
   */
  public async update(categoriesId: string, updateCategoriesDto: UpdateCategoriesDto) {
    try {
      const searchCategoriesDto = new SearchCategoriesDto()
      searchCategoriesDto.id = categoriesId
      const categories = await this.findOne(searchCategoriesDto)

      if (!categories) {
        throw new NotFoundException(MESSAGE.CATEGORY.NOT_FOUND)
      }

      if (updateCategoriesDto.name) {
        const searchCategoriesNameDto = new SearchCategoriesDto()
        searchCategoriesNameDto.name = updateCategoriesDto.name

        const categoriesNameDto = await this.findOne(searchCategoriesNameDto)
        if (categoriesNameDto && categoriesNameDto.id !== categoriesId) {
          throw new ConflictException(MESSAGE.CATEGORY.DUPLICATE_NAME)
        }
      }

      if (updateCategoriesDto.code) {
        const searchCategoriesCodeDto = new SearchCategoriesDto()
        searchCategoriesCodeDto.code = updateCategoriesDto.code

        const categoriesCode = await this.findOne(searchCategoriesCodeDto)
        if (categoriesCode && categoriesCode.id !== categoriesId) {
          throw new ConflictException(MESSAGE.CATEGORY.DUPLICATE_CODE)
        }
      }

      return await this.categoriesRepository.update(categories.id, {
        ...updateCategoriesDto,
        updatedAt: new Date()
      })
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Enable
   * @param categoriesId uuid
   */
  public async enable(categoriesId: string) {
    try {
      const searchCategoriesDto = new SearchCategoriesDto()
      searchCategoriesDto.id = categoriesId
      searchCategoriesDto.isActive = true

      const categories = await this.findOne(searchCategoriesDto)
      if (!categories) {
        throw new NotFoundException(MESSAGE.CATEGORY.NOT_FOUND)
      }

      await this.categoriesRepository.update(categories.id, {
        isEnabled: !categories.isEnabled,
        updatedAt: new Date()
      })
      const data = await this.findOne(searchCategoriesDto)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Delete
   * @param categoriesId uuid
   */
  public async delete(categoriesId: string) {
    try {
      const searchCategoriesDto = new SearchCategoriesDto()
      searchCategoriesDto.id = categoriesId
      const categories = await this.findOne(searchCategoriesDto)

      if (!categories) {
        throw new NotFoundException(MESSAGE.CATEGORY.NOT_FOUND)
      }

      await this.categoriesRepository.update(categories.id, {
        isActive: false,
        updatedAt: new Date()
      })
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }
}
