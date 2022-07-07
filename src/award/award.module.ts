import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AwardController } from './award.controller'
import { AwardService } from './award.service'
import { AwardRepository } from './award.repository'

@Module({
  imports: [TypeOrmModule.forFeature([AwardRepository])],
  controllers: [AwardController],
  providers: [AwardService]
})
export class AwardModule {}
