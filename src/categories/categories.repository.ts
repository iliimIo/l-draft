import { EntityRepository, Repository } from 'typeorm'
import { Categories } from './entities/categories.entity'

@EntityRepository(Categories)
export class CategoriesRepository extends Repository<Categories> {}
