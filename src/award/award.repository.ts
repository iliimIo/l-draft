import { EntityRepository, Repository } from 'typeorm'
import { Award } from './entities/award.entity'

@EntityRepository(Award)
export class AwardRepository extends Repository<Award> {}
