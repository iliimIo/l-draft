import { ConflictException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { GroupRepository } from './group.repository'
import { AwardService } from 'src/award/award.service'
import { SearchGroupDto } from './dto/search-group.dto'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { GroupsDailyDto } from './dto/response-group-daily.dto'
import { CategoriesService } from 'src/categories/categories.service'
import { SearchCategoriesDto } from 'src/categories/dto/search-categories.dto'
import { Group } from './entities/group.entity'
import { MESSAGE } from 'src/common/message/response'

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name)
  @Inject(forwardRef(() => AwardService))
  private awardService: AwardService

  constructor(
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService
  ) {}

  /**
   * Find all and pagination
   * @param searchGroupDto SearchGroupDto
   */
  public async findAllAndPagination(searchGroupDto: SearchGroupDto) {
    try {
      const [group, total] = await this.groupRepository.getAllAndPagination(searchGroupDto)
      return { data: group, total }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find daily awards
   * @param searchGroupDto SearchGroupDto
   */
  public async dailyAwards(searchGroupDto: SearchGroupDto) {
    try {
      searchGroupDto.isExchange = true
      searchGroupDto.isActive = true
      searchGroupDto.isEnabled = true
      const group = await this.groupRepository.getOne(searchGroupDto)
      const { awards, count } = await this.awardService.dailyGroupAwards(
        searchGroupDto.code,
        searchGroupDto.page,
        searchGroupDto.limit
      )

      const groupDailyDto = new GroupsDailyDto()
      groupDailyDto.name = group.name
      groupDailyDto.code = group.code
      groupDailyDto.awardsDaily = awards
      return { data: groupDailyDto, total: count }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find one
   * @param searchGroupDto SearchGroupDto
   */
  public async findOne(searchGroupDto: SearchGroupDto) {
    try {
      return await this.groupRepository.getOne(searchGroupDto)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find by id
   * @param searchGroupDto SearchGroupDto
   */
  public async findById(searchGroupDto: SearchGroupDto) {
    try {
      const group = await this.findOne(searchGroupDto)

      if (!group) {
        throw new NotFoundException(MESSAGE.GROUP.NOT_FOUND)
      }

      return { data: group }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Create
   * @param createGroupDto CreateGroupDto
   */
  public async create(createGroupDto: CreateGroupDto) {
    try {
      const searchGroupNameDto = new SearchGroupDto()
      searchGroupNameDto.name = createGroupDto.name
      const group = await this.findOne(searchGroupNameDto)

      if (group && !group?.isActive) {
        await this.groupRepository.update(group.id, {
          isActive: true,
          updatedAt: new Date()
        })
        const data = await this.groupRepository.findOne(group.id)
        return { data }
      }

      if (group) {
        throw new ConflictException(MESSAGE.GROUP.DUPLICATE_NAME)
      }

      const searchGroupCodeDto = new SearchGroupDto()
      searchGroupCodeDto.code = createGroupDto.code
      const groupCode = await this.findOne(searchGroupCodeDto)

      if (groupCode && !groupCode?.isActive) {
        await this.groupRepository.update(groupCode.id, {
          isActive: true,
          updatedAt: new Date()
        })
        const data = await this.groupRepository.findOne(groupCode.id)
        return { data }
      }

      if (groupCode) {
        throw new ConflictException(MESSAGE.GROUP.DUPLICATE_CODE)
      }

      const searchCategoriesDto = new SearchCategoriesDto()
      searchCategoriesDto.id = createGroupDto.categoriesId
      const categories = await this.categoriesService.findOne(searchCategoriesDto)
      if (!categories) {
        throw new NotFoundException(MESSAGE.CATEGORY.NOT_FOUND)
      }

      const newGroup = new Group()
      newGroup.name = createGroupDto.name
      newGroup.code = createGroupDto.code
      newGroup.categories = categories
      const data = await this.groupRepository.save(newGroup)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Update group
   * @param groupId string
   * @param updateGroupDto UpdateGroupDto
   */
  public async update(groupId: string, updateGroupDto: UpdateGroupDto) {
    try {
      const searchGroupDto = new SearchGroupDto()
      searchGroupDto.id = groupId
      const group = await this.findOne(searchGroupDto)

      if (!group) {
        throw new NotFoundException(MESSAGE.GROUP.NOT_FOUND)
      }

      if (updateGroupDto.name) {
        const searchGroupNameDto = new SearchGroupDto()
        searchGroupNameDto.name = updateGroupDto.name
        const groupName = await this.findOne(searchGroupNameDto)

        if (groupName && groupName.id !== groupId) {
          throw new ConflictException(MESSAGE.GROUP.DUPLICATE_NAME)
        }
      }

      if (updateGroupDto.code) {
        const searchGroupCodeDto = new SearchGroupDto()
        searchGroupCodeDto.code = updateGroupDto.code
        const groupCode = await this.findOne(searchGroupCodeDto)

        if (groupCode && groupCode.id !== groupId) {
          throw new ConflictException(MESSAGE.GROUP.DUPLICATE_CODE)
        }
      }

      let categories
      if (updateGroupDto.categoriesId) {
        const searchCategoriesDto = new SearchCategoriesDto()
        searchCategoriesDto.id = updateGroupDto.categoriesId
        const categoriesExist = await this.categoriesService.findOne(searchCategoriesDto)
        if (!categoriesExist) {
          throw new NotFoundException(MESSAGE.CATEGORY.NOT_FOUND)
        }
        categories = categoriesExist
      }

      await this.groupRepository.update(group.id, {
        name: updateGroupDto.name || group.name,
        code: updateGroupDto.code || group.code,
        categories: categories || group.categories,
        updatedAt: new Date()
      })
      const data = await this.findOne(searchGroupDto)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Enable
   * @param groupId uuid
   */
  public async enable(groupId: string) {
    try {
      const searchGroupDto = new SearchGroupDto()
      searchGroupDto.id = groupId
      searchGroupDto.isActive = true

      const group = await this.findOne(searchGroupDto)
      if (!group) {
        throw new NotFoundException(MESSAGE.GROUP.NOT_FOUND)
      }

      await this.groupRepository.update(group.id, {
        isEnabled: !group.isEnabled,
        updatedAt: new Date()
      })
      const data = await this.groupRepository.findOne(group.id)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Delete group
   * @param groupId string
   */
  public async delete(groupId: string) {
    try {
      const searchGroupDto = new SearchGroupDto()
      searchGroupDto.id = groupId
      const group = await this.findOne(searchGroupDto)

      if (!group) {
        throw new NotFoundException(MESSAGE.GROUP.NOT_FOUND)
      }

      await this.groupRepository.update(group.id, {
        isActive: false,
        updatedAt: new Date()
      })
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }
}
