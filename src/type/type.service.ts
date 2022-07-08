import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { TypeRepository } from './type.repository'
import { SearchTypeDto } from './dto/search-type.dto'
import { CreateTypeDto } from './dto/create-type.dto'
import { UpdateTypeDto } from './dto/update-type.dto'

@Injectable()
export class TypeService {
  private readonly logger = new Logger(TypeService.name)

  constructor(
    @InjectRepository(TypeRepository)
    private typeRepository: TypeRepository
  ) {}

  /**
   * Find all and pagination
   * @param searchTypeDto SearchTypeDto
   */
  public async findAllAndPagination(searchTypeDto: SearchTypeDto) {
    try {
      const [type, total] = await this.typeRepository.getAllAndPagination(searchTypeDto)
      return { data: type, total }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find one
   * @param searchTypeDto SearchTypeDto
   */
  public async findOne(searchTypeDto: SearchTypeDto) {
    try {
      return await this.typeRepository.getOne(searchTypeDto)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find by id
   * @param typeId string
   */
  public async findById(typeId: string) {
    try {
      const searchTypeDto = new SearchTypeDto()
      searchTypeDto.id = typeId
      const categories = await this.findOne(searchTypeDto)

      if (!categories) {
        throw new NotFoundException('Type not found')
      }

      return { data: categories }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Create type
   * @param createTypeDto CreateTypeDto
   */
  public async create(createTypeDto: CreateTypeDto) {
    try {
      const searchTypeDto = new SearchTypeDto()
      searchTypeDto.name = createTypeDto.name

      const type = await this.findOne(searchTypeDto)
      if (type) {
        throw new ConflictException('Type name already exist')
      }

      return await this.typeRepository.save(createTypeDto)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Update type
   * @param typeId string
   * @param updateTypeDto UpdateTypeDto
   */
  public async update(typeId: string, UpdateTypeDto: UpdateTypeDto) {
    try {
      const searchTypeDto = new SearchTypeDto()
      searchTypeDto.id = typeId
      const type = await this.findOne(searchTypeDto)

      if (!type) {
        throw new NotFoundException('Type not found')
      }

      const searchTypeNameDto = new SearchTypeDto()
      searchTypeNameDto.name = UpdateTypeDto.name
      const typeName = await this.findOne(searchTypeNameDto)

      if (typeName) {
        throw new ConflictException('Type name already exist')
      }

      return await this.typeRepository.update(type.id, {
        ...UpdateTypeDto,
        updatedAt: new Date()
      })
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Delete type
   * @param typeId string
   */
  public async delete(typeId: string) {
    try {
      const searchTypeDto = new SearchTypeDto()
      searchTypeDto.id = typeId

      const type = await this.findOne(searchTypeDto)
      if (!type) {
        throw new NotFoundException('Type not found')
      }

      await this.typeRepository.update(type.id, {
        isActive: false,
        deletedAt: new Date()
      })
      return await this.typeRepository.softDelete(type.id)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }
}
