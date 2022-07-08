import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AwardRepository } from './award.repository'
import { CreateAwardDto } from './dto/create-award.dto'
import { SearchAwardDto } from './dto/search-award.dto'
import { CategoriesService } from 'src/categories/categories.service'
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
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
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
   * Find one
   * @param searchCategoriesDto SearchCategoriesDto
   */
  public async findOne(searchCategoriesDto: SearchAwardDto) {
    try {
      return await this.awardRepository.getOne(searchCategoriesDto)
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
    const { number, periodDate, categoriesId, groupId, typeId } = createAwardDto
    try {
      const categories = await this.categoriesService.findById(categoriesId)
      const group = await this.groupService.findById(groupId)
      const type = await this.typeService.findById(typeId)

      const award = new Award()
      award.number = number
      award.periodDate = new Date(periodDate)
      award.categories = categories.data
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
    const { number, periodDate, categoriesId, groupId, typeId } = updateAwardDto

    try {
      const searchAwardDto = new SearchAwardDto()
      searchAwardDto.id = awardId
      const award = await this.findOne(searchAwardDto)

      if (!award) {
        throw new NotFoundException('Award not found')
      }

      const updateAward = new Award()

      if (categoriesId) {
        const categories = await this.categoriesService.findById(categoriesId)
        updateAward.categories = categories.data
      }

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
