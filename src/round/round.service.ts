import { ConflictException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MESSAGE } from 'src/common/message/response'
import { CreateRoundDto } from './dto/create-round.dto'
import { SearchRoundDto } from './dto/search-round.dto'
import { UpdateRoundDto } from './dto/update-round.dto'
import { Round } from './entities/round.entity'
import { RoundRepository } from './round.repository'
import { RoundTypeService } from 'src/round-type/round-type.service'
import { SearchRoundTypeDto } from 'src/round-type/dto/search-round-type.dto'
import { SearchGroupDto } from 'src/group/dto/search-group.dto'
import { GroupService } from 'src/group/group.service'

@Injectable()
export class RoundService {
  private readonly logger = new Logger(RoundService.name)
  constructor(
    @InjectRepository(RoundRepository)
    private roundRepository: RoundRepository,
    @Inject(forwardRef(() => RoundTypeService))
    private roundTypeService: RoundTypeService,
    @Inject(forwardRef(() => GroupService))
    private groupService: GroupService
  ) {}

  /**
   * Find all and pagination
   * @param searchRoundDto SearchRoundDto
   */
  public async findAllAndPagination(searchRoundDto: SearchRoundDto) {
    try {
      const [round, total] = await this.roundRepository.getAllAndPagination(searchRoundDto)
      return { data: round, total }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find one
   * @param searchRoundDto SearchRoundDto
   */
  public async findOne(searchRoundDto: SearchRoundDto) {
    try {
      return await this.roundRepository.getOne(searchRoundDto)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find by id
   * @param searchRoundDto SearchRoundDto
   */
  public async findById(searchRoundDto: SearchRoundDto) {
    try {
      const categories = await this.findOne(searchRoundDto)

      if (!categories) {
        throw new NotFoundException(MESSAGE.ROUND.NOT_FOUND)
      }

      return { data: categories }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Create
   * @param createRoundDto CreateRoundDto
   */
  public async create(createRoundDto: CreateRoundDto) {
    try {
      const { name, rewardTime, rewardDay, roundTypeId, groupId } = createRoundDto
      const searchRoundTypeDto = new SearchRoundTypeDto()
      searchRoundTypeDto.id = roundTypeId
      searchRoundTypeDto.isActive = true
      searchRoundTypeDto.isEnabled = true
      const roundType = await this.roundTypeService.findById(searchRoundTypeDto)

      const searchGroupDto = new SearchGroupDto()
      searchGroupDto.id = groupId
      searchGroupDto.isActive = true
      searchGroupDto.isEnabled = true
      const group = await this.groupService.findById(searchGroupDto)

      const round = new Round()
      round.name = name
      round.rewardTime = rewardTime
      round.roundType = roundType.data
      round.group = group.data
      round.rewardDay = rewardDay

      const data = await this.roundRepository.save(round)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Update
   * @param roundId uuid
   * @param updateRoundDto UpdateRoundDto
   */
  public async update(roundId: string, updateRoundDto: UpdateRoundDto) {
    try {
      const searchRoundDto = new SearchRoundDto()
      searchRoundDto.id = roundId
      const round = await this.findOne(searchRoundDto)

      if (!round) {
        throw new NotFoundException(MESSAGE.ROUND.NOT_FOUND)
      }

      let roundType
      if (updateRoundDto.roundTypeId) {
        const searchRoundTypeDto = new SearchRoundTypeDto()
        searchRoundTypeDto.id = updateRoundDto.roundTypeId
        searchRoundTypeDto.isActive = true
        searchRoundTypeDto.isEnabled = true
        roundType = await this.roundTypeService.findOne(searchRoundTypeDto)
      }

      if (updateRoundDto.groupId) {
        const searchGroupDto = new SearchGroupDto()
        searchGroupDto.id = updateRoundDto.groupId
        searchGroupDto.isActive = true
        searchGroupDto.isEnabled = true
        await this.groupService.findOne(searchGroupDto)
      }

      await this.roundRepository.update(round.id, {
        ...round,
        name: updateRoundDto.name || round.name,
        rewardTime: updateRoundDto.rewardTime || round.rewardTime,
        rewardDay: updateRoundDto.rewardDay || round.rewardDay,
        roundType: roundType?.data || round.roundType,
        updatedAt: new Date()
      })

      const data = await this.roundRepository.findOne(round.id)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Enable
   * @param roundId uuid
   */
  public async enable(roundId: string) {
    try {
      const searchRoundDto = new SearchRoundDto()
      searchRoundDto.id = roundId
      searchRoundDto.isActive = true

      const round = await this.findOne(searchRoundDto)
      if (!round) {
        throw new NotFoundException(MESSAGE.ROUND.NOT_FOUND)
      }

      await this.roundRepository.update(round.id, {
        isEnabled: !round.isEnabled,
        updatedAt: new Date()
      })
      const data = await this.roundRepository.findOne(round.id)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Delete type
   * @param roundId uuid
   */
  public async delete(roundId: string) {
    try {
      const searchRoundDto = new SearchRoundDto()
      searchRoundDto.id = roundId

      const round = await this.findOne(searchRoundDto)
      if (!round) {
        throw new NotFoundException(MESSAGE.ROUND.NOT_FOUND)
      }

      await this.roundRepository.update(round.id, {
        isActive: false,
        updatedAt: new Date()
      })
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }
}
