import { ConflictException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoriesRepository } from './categories.repository'
import { SearchCategoriesDto } from './dto/search-categories.dto'
import { CreateCategoriesDto } from './dto/create-categories.dto'
import { UpdateCategoriesDto } from './dto/update-categories.dto'
import { AwardService } from 'src/award/award.service'
import { CategoriesDailyDto, GroupsDto, AwardDto, TypeDto } from './dto/response-categories-daily.dto'

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
          groupDto.awards = []

          const awardList = await this.awardService.dailyAwards(group.code)
          if (awardList) {
            for (const award of awardList) {
              const typeDto = new TypeDto()
              typeDto.name = award.type.name

              const awardDto = new AwardDto()
              awardDto.number = award.number
              awardDto.periodDate = award.periodDate
              awardDto.type = typeDto
              groupDto.awards.push(awardDto)
            }
          }
          categoriesDto.groups.push(groupDto)
        }
        data.push(categoriesDto)
      }
      return { data: data }
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
   * @param categoriesId string
   */
  public async findById(categoriesId: string) {
    try {
      const searchCategoriesDto = new SearchCategoriesDto()
      searchCategoriesDto.id = categoriesId
      searchCategoriesDto.isPublic = true
      const categories = await this.findOne(searchCategoriesDto)

      if (!categories) {
        throw new NotFoundException('Categories not found')
      }

      return { data: categories }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /** Active a status
   *  @param categoriesId string
   */
  public async status(categoriesId: string) {
    try {
      const searchCategoriesDto = new SearchCategoriesDto()
      searchCategoriesDto.id = categoriesId
      searchCategoriesDto

      const categories = await this.findOne(searchCategoriesDto)

      if (!categories) {
        throw new NotFoundException('Categories not found')
      }

      return await this.categoriesRepository.update(categories.id, { isPublic: !categories.isPublic })
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Create categories
   * @param createBankingDto CreateBankingDto
   */
  public async create(createCategoriesDto: CreateCategoriesDto) {
    try {
      const searchCategoriesDto = new SearchCategoriesDto()
      searchCategoriesDto.name = createCategoriesDto.name

      const categories = await this.findOne(searchCategoriesDto)
      if (categories) {
        throw new ConflictException('Categories name already exist')
      }

      const searchCategoriesCodeDto = new SearchCategoriesDto()
      searchCategoriesCodeDto.code = createCategoriesDto.code

      const categoriesCode = await this.findOne(searchCategoriesCodeDto)
      if (categoriesCode) {
        throw new ConflictException('Categories code already exist')
      }

      return await this.categoriesRepository.save(createCategoriesDto)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Update categories
   * @param categories string
   * @param updateCategoriesDto UpdateCategoriesDto
   */
  public async update(categoriesId: string, updateCategoriesDto: UpdateCategoriesDto) {
    try {
      const searchCategoriesDto = new SearchCategoriesDto()
      searchCategoriesDto.id = categoriesId
      const categories = await this.findOne(searchCategoriesDto)

      if (!categories) {
        throw new NotFoundException('Categories not found')
      }

      if (updateCategoriesDto.name) {
        const searchCategoriesNameDto = new SearchCategoriesDto()
        searchCategoriesNameDto.name = updateCategoriesDto.name
        const categoriesNameDto = await this.findOne(searchCategoriesNameDto)

        if (categoriesNameDto) {
          throw new ConflictException('Categories name already exist')
        }
      }

      if (updateCategoriesDto.code) {
        const searchCategoriesCodeDto = new SearchCategoriesDto()
        searchCategoriesCodeDto.code = updateCategoriesDto.code

        const categoriesCode = await this.findOne(searchCategoriesCodeDto)

        if (categoriesCode) {
          throw new ConflictException('Categories code already exist')
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
   * Delete categories
   * @param categoriesId string
   */
  public async delete(categoriesId: string) {
    try {
      const searchCategoriesDto = new SearchCategoriesDto()
      searchCategoriesDto.id = categoriesId
      const categories = await this.findOne(searchCategoriesDto)

      if (!categories) {
        throw new NotFoundException('Categories not found')
      }

      await this.categoriesRepository.update(categories.id, {
        isActive: false,
        deletedAt: new Date()
      })
      return await this.categoriesRepository.softDelete(categories.id)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }
}
