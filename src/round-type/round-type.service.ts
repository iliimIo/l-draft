import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MESSAGE } from 'src/common/message/response'
import { CreateRoundTypeDto } from './dto/create-round-type.dto'
import { SearchRoundTypeDto } from './dto/search-round-type.dto'
import { UpdateRoundTypeDto } from './dto/update-round-type.dto'
import { RoundTypeRepository } from './round-type.repository'

@Injectable()
export class RoundTypeService {
  private readonly logger = new Logger(RoundTypeService.name)
  constructor(
    @InjectRepository(RoundTypeRepository)
    private roundTypeRepository: RoundTypeRepository
  ) {}

  /**
   * Find all and pagination
   * @param searchRoundTypeDto SearchRoundTypeDto
   */
  public async findAllAndPagination(searchRoundTypeDto: SearchRoundTypeDto) {
    try {
      const [roundType, total] = await this.roundTypeRepository.getAllAndPagination(searchRoundTypeDto)
      return { data: roundType, total }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find one
   * @param searchRoundTypeDto SearchRoundTypeDto
   */
  public async findOne(searchRoundTypeDto: SearchRoundTypeDto) {
    try {
      return await this.roundTypeRepository.getOne(searchRoundTypeDto)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find by id
   * @param searchRoundTypeDto SearchRoundTypeDto
   */
  public async findById(searchRoundTypeDto: SearchRoundTypeDto) {
    try {
      const roundType = await this.findOne(searchRoundTypeDto)

      if (!roundType) {
        throw new NotFoundException(MESSAGE.ROUND_TYPE.NOT_FOUND)
      }

      return { data: roundType }
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
      return await this.roundTypeRepository.findByIds(ids)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Create
   * @param createRoundTypeDto CreateRoundTypeDto
   */
  public async create(createRoundTypeDto: CreateRoundTypeDto) {
    try {
      const searchRoundTypeDto = new SearchRoundTypeDto()
      searchRoundTypeDto.name = createRoundTypeDto.name

      const roundType = await this.findOne(searchRoundTypeDto)

      if (roundType && !roundType?.isActive) {
        await this.roundTypeRepository.update(roundType.id, {
          isActive: true,
          updatedAt: new Date()
        })
        const data = await this.roundTypeRepository.findOne(roundType.id)
        return { data }
      }

      if (roundType) {
        throw new ConflictException(MESSAGE.ROUND_TYPE.DUPLICATE)
      }

      const data = await this.roundTypeRepository.save(createRoundTypeDto)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Update
   * @param roundTypeId uuid
   * @param updateRoundTypeDto UpdateRoundTypeDto
   */
  public async update(roundTypeId: string, updateRoundTypeDto: UpdateRoundTypeDto) {
    try {
      const searchRoundTypeDto = new SearchRoundTypeDto()

      searchRoundTypeDto.id = roundTypeId
      console.log(roundTypeId, updateRoundTypeDto, searchRoundTypeDto)
      const roundType = await this.findOne(searchRoundTypeDto)

      if (!roundType) {
        throw new NotFoundException(MESSAGE.ROUND_TYPE.NOT_FOUND)
      }

      const searchRoundTypeNameDto = new SearchRoundTypeDto()
      searchRoundTypeNameDto.name = updateRoundTypeDto.name
      const roundTypeName = await this.findOne(searchRoundTypeNameDto)

      if (roundTypeName && roundTypeName.id !== roundType.id) {
        throw new ConflictException(MESSAGE.ROUND_TYPE.DUPLICATE)
      }

      await this.roundTypeRepository.update(roundType.id, {
        ...UpdateRoundTypeDto,
        updatedAt: new Date()
      })

      const data = await this.roundTypeRepository.findOne(roundType.id)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Enable
   * @param roundTypeId uuid
   */
  public async enable(roundTypeId: string) {
    try {
      const searchRoundTypeDto = new SearchRoundTypeDto()
      searchRoundTypeDto.id = roundTypeId
      searchRoundTypeDto.isActive = true

      const roundType = await this.findOne(searchRoundTypeDto)
      if (!roundType) {
        throw new NotFoundException(MESSAGE.ROUND_TYPE.NOT_FOUND)
      }

      await this.roundTypeRepository.update(roundType.id, {
        isEnabled: !roundType.isEnabled,
        updatedAt: new Date()
      })
      const data = await this.roundTypeRepository.findOne(roundType.id)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Delete type
   * @param roundTypeId uuid
   */
  public async delete(roundTypeId: string) {
    try {
      const searchRoundTypeDto = new SearchRoundTypeDto()
      searchRoundTypeDto.id = roundTypeId

      const roundType = await this.findOne(searchRoundTypeDto)
      if (!roundType) {
        throw new NotFoundException(MESSAGE.ROUND_TYPE.NOT_FOUND)
      }

      await this.roundTypeRepository.update(roundType.id, {
        isActive: false,
        updatedAt: new Date()
      })
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }
}
