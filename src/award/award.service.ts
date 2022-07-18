import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AwardRepository } from './award.repository'
import { CreateAwardDto } from './dto/create-award.dto'
import { SearchAwardDto } from './dto/search-award.dto'
import { GroupService } from 'src/group/group.service'
import { TypeService } from 'src/type/type.service'
import { Award } from './entities/award.entity'
import { UpdateAwardDto } from './dto/update-award.dto'

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
   * Find daily award
   */
  // public async daily() {
  //   try {
  //     const searchCategoriesDto = new SearchCategoriesDto()
  //     searchCategoriesDto.page = '1'
  //     searchCategoriesDto.limit = '10'
  //     const categoriesList = await this.categoriesService.findAllAndPagination(searchCategoriesDto)

  //     const daily = []
  //     for (const categories of categoriesList.data) {
  //       const categoriesDto = new CategoriesDailyDto()
  //       categoriesDto.name = categories.name
  //       categoriesDto.group = []

  //       const searchAwardDto = new SearchAwardDto()
  //       // searchAwardDto.categoriesId = categories.id
  //       const groupList = await this.awardRepository.groupByCategory(searchAwardDto)

  //       for (const group of groupList) {
  //         const groupDto = new GroupDailyDto()
  //         groupDto.name = group.group_name
  //         groupDto.periodDate = new Date()
  //         groupDto.code = group.group_code

  //         groupDto.awards = []

  //         const searchAwardDto = new SearchAwardDto()
  //         // searchAwardDto.categoriesId = categories.id
  //         searchAwardDto.groupId = group.group_id
  //         const typeList = await this.awardRepository.groupByType(searchAwardDto)

  //         for (const type of typeList) {
  //           const searchAwardDto = new SearchAwardDto()
  //           // searchAwardDto.categoriesId = categories.id
  //           searchAwardDto.groupId = group.group_id
  //           searchAwardDto.typeId = type.type_id

  //           const award = await this.findOne(searchAwardDto)
  //           groupDto.periodDate = award.periodDate

  //           if (award) {
  //             const typeDto = new TypeDailyDto()
  //             typeDto.name = award.type.name
  //             const awardDto = new AwardDailyDto()
  //             awardDto.number = award.number
  //             awardDto.periodDate = award.periodDate

  //             awardDto.type = typeDto
  //             groupDto.awards.push(awardDto)
  //           }
  //         }

  //         if (groupDto.awards.length > 0) {
  //           categoriesDto.group.push(groupDto)
  //         }
  //       }
  //       daily.push(categoriesDto)
  //     }

  //     return { data: daily }
  //   } catch (error) {
  //     this.logger.error(JSON.stringify(error))
  //     throw error
  //   }
  // }

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

      const award = new Award()
      award.number = number
      award.periodDate = new Date(periodDate)
      award.group = group.data
      award.type = type.data

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
