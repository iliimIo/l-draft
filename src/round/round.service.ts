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
   * Find by ids
   * @param ids uuid[]
   */
  public async findByIds(ids: string[]) {
    try {
      return await this.roundRepository.findByIds(ids)
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
      const { name, startDate, endDate, roundTypeId, groupId } = createRoundDto
      const searchRoundTypeDto = new SearchRoundTypeDto()
      searchRoundTypeDto.id = roundTypeId
      searchRoundTypeDto.isActive = true
      searchRoundTypeDto.isEnabled = true
      const roundType = await this.roundTypeService.findById(searchRoundTypeDto)

      if (!roundType) {
        throw new NotFoundException(MESSAGE.ROUND_TYPE.NOT_FOUND)
      }

      const searchGroupDto = new SearchGroupDto()
      searchGroupDto.id = groupId
      searchGroupDto.isActive = true
      searchGroupDto.isEnabled = true
      const group = await this.groupService.findById(searchGroupDto)

      if (!roundType) {
        throw new NotFoundException(MESSAGE.GROUP.NOT_FOUND)
      }

      const searchRoundDto = new SearchRoundDto()
      searchRoundDto.name = createRoundDto.name
      searchRoundDto.startDate = createRoundDto.startDate
      searchRoundDto.endDate = createRoundDto.endDate
      searchRoundDto.roundTypeId = createRoundDto.roundTypeId

      const round = new Round()
      round.name = name
      round.startDate = new Date(startDate)
      round.endDate = new Date(endDate)
      round.roundType = roundType.data
      round.group = group.data
      round.date = ''
      round.day = ''

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

      const searchRoundNameDto = new SearchRoundDto()
      searchRoundNameDto.name = updateRoundDto.name
      const roundTypeName = await this.findOne(searchRoundNameDto)

      if (roundTypeName && roundTypeName.id !== round.id) {
        throw new ConflictException(MESSAGE.ROUND_TYPE.DUPLICATE)
      }

      await this.roundRepository.update(round.id, {
        ...UpdateRoundDto,
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
