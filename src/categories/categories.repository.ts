import { EntityRepository, Repository } from 'typeorm'
import { InternalServerErrorException, Logger } from '@nestjs/common'
import { Categories } from './entities/categories.entity'

@EntityRepository(Categories)
export class CategoriesRepository extends Repository<Categories> {
  private logger = new Logger(CategoriesRepository.name)

  /**
   * Get all and pagination
   * @param searchBankingDto SearchBankingDto
   */
  async getAllAndPagination() {
    try {
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }

  /**
   * Get One
   * @param searchBankingDto
   */
  async getOne() {
    try {
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new InternalServerErrorException()
    }
  }
}
