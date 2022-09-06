import { AwardTypeService } from './../award-type/award-type.service'
import { SearchAwardTypeDto } from './../award-type/dto/search-type.dto'
import { ConflictException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ExchangeRateRepository } from './exchange-rate.repository'
import { SearchExchangeRateDto } from './dto/search-exchange-rate.dto'
import { MESSAGE } from 'src/common/message/response'
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto'
import { GroupService } from 'src/group/group.service'
import { SearchGroupDto } from 'src/group/dto/search-group.dto'
import { UpdateExchangeRateDto } from './dto/update-exchange-rate.dto'

@Injectable()
export class ExchangeRateService {
  private readonly logger = new Logger(ExchangeRateService.name)

  constructor(
    @InjectRepository(ExchangeRateRepository)
    private exchangeRateRepository: ExchangeRateRepository,
    @Inject(forwardRef(() => GroupService))
    private groupService: GroupService,
    @Inject(forwardRef(() => AwardTypeService))
    private awardTypeService: AwardTypeService
  ) {}

  /**
   * Find all and pagination
   * @param searchExchangeRateDto SearchExchangeRateDto
   */
  public async findAllAndPagination(searchExchangeRateDto: SearchExchangeRateDto) {
    try {
      const [exchangeRate, total] = await this.exchangeRateRepository.getAllAndPagination(searchExchangeRateDto)
      return { data: exchangeRate, total }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find one
   * @param searchExchangeRateDto SearchExchangeRateDto
   */
  public async findOne(searchExchangeRateDto: SearchExchangeRateDto) {
    try {
      return await this.exchangeRateRepository.getOne(searchExchangeRateDto)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Find by id
   * @param searchExchangeRateDto SearchExchangeRateDto
   */
  public async findById(searchExchangeRateDto: SearchExchangeRateDto) {
    try {
      const exchange = await this.findOne(searchExchangeRateDto)
      if (!exchange) {
        throw new NotFoundException(MESSAGE.EXCHANGE.NOT_FOUND)
      }

      return { data: exchange }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Create
   * @param createExchangeRateDto CreateExchangeRateDto
   */
  public async create(createExchangeRateDto: CreateExchangeRateDto) {
    try {
      const searchExchangeRateDto = new SearchExchangeRateDto()
      searchExchangeRateDto.exchange = createExchangeRateDto.exchange
      searchExchangeRateDto.awardTypeId = createExchangeRateDto.awardTypeId
      searchExchangeRateDto.groupId = createExchangeRateDto.groupId

      const exchangeRate = await this.findOne(searchExchangeRateDto)
      if (exchangeRate && !exchangeRate?.isActive) {
        await this.exchangeRateRepository.update(exchangeRate.id, {
          isActive: true,
          updatedAt: new Date()
        })
        const data = await this.exchangeRateRepository.findOne(exchangeRate.id)
        return { data }
      }

      if (exchangeRate) {
        throw new ConflictException(MESSAGE.EXCHANGE.DUPLICATE)
      }

      const searchAwardTypeDto = new SearchAwardTypeDto()
      searchAwardTypeDto.id = createExchangeRateDto.awardTypeId
      const awardType = await this.awardTypeService.findById(searchAwardTypeDto)

      const searchGroupDto = new SearchGroupDto()
      searchGroupDto.id = createExchangeRateDto.groupId
      const group = await this.groupService.findById(searchGroupDto)

      const data = await this.exchangeRateRepository.save({
        quantity: Number(createExchangeRateDto.quantity),
        exchange: Number(createExchangeRateDto.exchange),
        type: awardType.data,
        group: group.data
      })
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Update
   * @param exchangeId uuid
   * @param updateExchangeRateDto UpdateExchangeRateDto
   */
  public async update(exchangeId: string, updateExchangeRateDto: UpdateExchangeRateDto) {
    try {
      const searchExchangeRateDto = new SearchExchangeRateDto()
      searchExchangeRateDto.id = exchangeId
      searchExchangeRateDto.isActive = true

      const exchange = await this.findOne(searchExchangeRateDto)
      if (!exchange) {
        throw new NotFoundException(MESSAGE.EXCHANGE.NOT_FOUND)
      }

      if (updateExchangeRateDto.exchange) {
        const searchExchangeRatePriceDto = new SearchExchangeRateDto()
        searchExchangeRatePriceDto.exchange = updateExchangeRateDto.exchange
        searchExchangeRatePriceDto.awardTypeId = exchange.type.id
        searchExchangeRatePriceDto.groupId = exchange.group.id

        const exchangeRatePrice = await this.findOne(searchExchangeRatePriceDto)
        if (exchangeRatePrice && exchangeRatePrice.id !== exchangeId) {
          throw new ConflictException(MESSAGE.EXCHANGE.DUPLICATE)
        }
      }

      await this.exchangeRateRepository.update(exchange.id, {
        ...updateExchangeRateDto,
        quantity: Number(updateExchangeRateDto.quantity),
        exchange: Number(updateExchangeRateDto.exchange),
        updatedAt: new Date()
      })
      const data = await this.exchangeRateRepository.findOne(exchange.id)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Enable
   * @param exchangeId uuid
   */
  public async enable(exchangeId: string) {
    try {
      const searchExchangeRateDto = new SearchExchangeRateDto()
      searchExchangeRateDto.id = exchangeId
      searchExchangeRateDto.isActive = true

      const exchange = await this.findOne(searchExchangeRateDto)
      if (!exchange) {
        throw new NotFoundException(MESSAGE.EXCHANGE.NOT_FOUND)
      }

      await this.exchangeRateRepository.update(exchange.id, {
        isEnabled: !exchange.isEnabled,
        updatedAt: new Date()
      })
      const data = await this.exchangeRateRepository.findOne(exchange.id)
      return { data }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  /**
   * Delete
   * @param exchangeId uuid
   */
  public async delete(exchangeId: string) {
    try {
      const searchExchangeRateDto = new SearchExchangeRateDto()
      searchExchangeRateDto.id = exchangeId
      searchExchangeRateDto.isActive = true

      const exchange = await this.findOne(searchExchangeRateDto)
      if (!exchange) {
        throw new NotFoundException(MESSAGE.EXCHANGE.NOT_FOUND)
      }

      return await this.exchangeRateRepository.update(exchange.id, {
        isActive: false,
        updatedAt: new Date()
      })
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }
}
