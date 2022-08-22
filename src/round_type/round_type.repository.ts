import { InternalServerErrorException, Logger } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { RoundType } from './entities/round_type.entity'


@EntityRepository(RoundType)
export class RoundTypeRepository extends Repository<RoundType> {
  private logger = new Logger(RoundTypeRepository.name)

  

}
