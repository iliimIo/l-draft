import { ConflictException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { GroupRepository } from './group.repository'
import { AwardService } from 'src/award/award.service'
import { SearchGroupDto } from './dto/search-group.dto'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { GroupsDailyDto } from './dto/response-group-daily.dto'

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name)
  @Inject(forwardRef(() => AwardService))
  private awardService: AwardService

  constructor(
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository
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
      const group = await this.groupRepository.getOne(searchGroupDto)
      const dateAwards = await this.awardService.dailyDateAwards(searchGroupDto.code)

      const groupDailyDto = new GroupsDailyDto()
      groupDailyDto.name = group.name
      groupDailyDto.code = group.code
      groupDailyDto.awardsDaily = dateAwards
      return { data: groupDailyDto }
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
   * @param groupId string
   */
  public async findById(groupId: string) {
    try {
      const searchGroupDto = new SearchGroupDto()
      searchGroupDto.id = groupId
      searchGroupDto.isPublic = true
      const group = await this.findOne(searchGroupDto)

      if (!group) {
        throw new NotFoundException('Group not found')
      }

      return { data: group }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /** Active a status
   *  @param groupId string
   */
  public async status(groupId: string) {
    try {
      const searchGroupDto = new SearchGroupDto()
      searchGroupDto.id = groupId
      searchGroupDto

      const group = await this.findOne(searchGroupDto)

      if (!group) {
        throw new NotFoundException('Categories not found')
      }

      return await this.groupRepository.update(group.id, { isPublic: !group.isPublic })
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Create group
   * @param createGroupDto CreateGroupDto
   */
  public async create(createGroupDto: CreateGroupDto) {
    try {
      const searchGroupNameDto = new SearchGroupDto()
      searchGroupNameDto.name = createGroupDto.name

      const categories = await this.findOne(searchGroupNameDto)
      if (categories) {
        throw new ConflictException('Group name already exist')
      }

      const searchGroupCodeDto = new SearchGroupDto()
      searchGroupCodeDto.code = createGroupDto.code

      const categoriesCode = await this.findOne(searchGroupCodeDto)
      if (categoriesCode) {
        throw new ConflictException('Group code already exist')
      }

      return await this.groupRepository.save(createGroupDto)
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
        throw new NotFoundException('Group not found')
      }

      if (updateGroupDto.name) {
        const searchGroupNameDto = new SearchGroupDto()
        searchGroupNameDto.name = updateGroupDto.name
        const groupName = await this.findOne(searchGroupNameDto)

        if (groupName) {
          throw new ConflictException('Group name already exist')
        }
      }

      if (updateGroupDto.code) {
        const searchGroupCodeDto = new SearchGroupDto()
        searchGroupCodeDto.code = updateGroupDto.code

        const groupCode = await this.findOne(searchGroupCodeDto)

        if (groupCode) {
          throw new ConflictException('Group code already exist')
        }
      }

      return await this.groupRepository.update(group.id, {
        ...updateGroupDto,
        updatedAt: new Date()
      })
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
        throw new NotFoundException('Group not found')
      }

      await this.groupRepository.update(group.id, {
        isActive: false,
        deletedAt: new Date()
      })
      return await this.groupRepository.softDelete(group.id)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }
}
