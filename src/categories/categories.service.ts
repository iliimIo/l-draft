import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoriesRepository } from './categories.repository'
import { SearchCategoriesDto } from './dto/search-categories.dto'

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name)

  constructor(
    @InjectRepository(CategoriesRepository)
    private categoriesRepository: CategoriesRepository
  ) {}

  /**
   * Find all and pagination
   * @param searchCategoriesDto SearchCategoriesDto
   */
  public async findAllAndPagination(searchCategoriesDto: SearchCategoriesDto) {
    try {
      const [categories, total] = await this.categoriesRepository.getAllAndPagination(searchCategoriesDto)
      return { data: categories, total }
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }
}
