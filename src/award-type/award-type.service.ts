import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { AwardTypeRepository } from './award-type.repository'
import { SearchAwardTypeDto } from './dto/search-type.dto'
import { CreateTypeDto } from './dto/create-type.dto'
import { UpdateTypeDto } from './dto/update-type.dto'
import { MESSAGE } from 'src/common/message/response'

@Injectable()
export class AwardTypeService {
  private readonly logger = new Logger(AwardTypeService.name)

  constructor(
    @InjectRepository(AwardTypeRepository)
    private awardTypeRepository: AwardTypeRepository
  ) {}

  /**
   * Find all and pagination
   * @param searchAwardTypeDto SearchAwardTypeDto
   */
  public async findAllAndPagination(searchAwardTypeDto: SearchAwardTypeDto) {
    try {
      const [type, total] = await this.awardTypeRepository.getAllAndPagination(searchAwardTypeDto)
      return { data: type, total }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find one
   * @param searchAwardTypeDto SearchAwardTypeDto
   */
  public async findOne(searchAwardTypeDto: SearchAwardTypeDto) {
    try {
      return await this.awardTypeRepository.getOne(searchAwardTypeDto)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find by id
   * @param searchAwardTypeDto SearchAwardTypeDto
   */
  public async findById(searchAwardTypeDto: SearchAwardTypeDto) {
    try {
      const categories = await this.findOne(searchAwardTypeDto)

      if (!categories) {
        throw new NotFoundException(MESSAGE.AWARD_TYPE.NOT_FOUND)
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
      return await this.awardTypeRepository.findByIds(ids)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Create
   * @param createTypeDto CreateTypeDto
   */
  public async create(createTypeDto: CreateTypeDto) {
    try {
      const searchAwardTypeDto = new SearchAwardTypeDto()
      searchAwardTypeDto.name = createTypeDto.name

      const awardType = await this.findOne(searchAwardTypeDto)

      if (awardType && !awardType?.isActive) {
        await this.awardTypeRepository.update(awardType.id, {
          isActive: true,
          updatedAt: new Date()
        })
        const data = await this.awardTypeRepository.findOne(awardType.id)
        return { data }
      }

      if (awardType) {
        throw new ConflictException(MESSAGE.AWARD_TYPE.DUPLICATE)
      }

      const data = await this.awardTypeRepository.save(createTypeDto)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Update
   * @param awardTypeId uuid
   * @param updateTypeDto UpdateTypeDto
   */
  public async update(awardTypeId: string, UpdateTypeDto: UpdateTypeDto) {
    try {
      const searchAwardTypeDto = new SearchAwardTypeDto()
      searchAwardTypeDto.id = awardTypeId
      const awardType = await this.findOne(searchAwardTypeDto)

      if (!awardType) {
        throw new NotFoundException(MESSAGE.AWARD_TYPE.NOT_FOUND)
      }

      const searchAwardTypeNameDto = new SearchAwardTypeDto()
      searchAwardTypeNameDto.name = UpdateTypeDto.name
      const awardTypeName = await this.findOne(searchAwardTypeNameDto)

      if (awardTypeName && awardTypeName.id !== awardType.id) {
        throw new ConflictException(MESSAGE.AWARD_TYPE.DUPLICATE)
      }

      await this.awardTypeRepository.update(awardType.id, {
        ...UpdateTypeDto,
        updatedAt: new Date()
      })

      const data = await this.awardTypeRepository.findOne(awardType.id)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Enable
   * @param awardTypeId uuid
   */
  public async enable(awardTypeId: string) {
    try {
      const searchAwardTypeDto = new SearchAwardTypeDto()
      searchAwardTypeDto.id = awardTypeId
      searchAwardTypeDto.isActive = true

      const awardType = await this.findOne(searchAwardTypeDto)
      if (!awardType) {
        throw new NotFoundException(MESSAGE.AWARD_TYPE.NOT_FOUND)
      }

      await this.awardTypeRepository.update(awardType.id, {
        isEnabled: !awardType.isEnabled,
        updatedAt: new Date()
      })
      const data = await this.awardTypeRepository.findOne(awardType.id)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Delete type
   * @param awardTypeId uuid
   */
  public async delete(awardTypeId: string) {
    try {
      const searchAwardTypeDto = new SearchAwardTypeDto()
      searchAwardTypeDto.id = awardTypeId

      const awardType = await this.findOne(searchAwardTypeDto)
      if (!awardType) {
        throw new NotFoundException(MESSAGE.AWARD_TYPE.NOT_FOUND)
      }

      await this.awardTypeRepository.update(awardType.id, {
        isActive: false,
        updatedAt: new Date()
      })
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }
}
