import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AwardManagementController } from './award-menegement.controller'
import { AwardController } from './award.controller'
import { AwardService } from './award.service'
import { AwardRepository } from './award.repository'
import { AuthModule } from 'src/auth/auth.module'
import { ExchangeRateModule } from './../exchange-rate/exchange-rate.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([AwardRepository]),
    forwardRef(() => AuthModule),
    forwardRef(() => ExchangeRateModule)
  ],
  controllers: [AwardManagementController, AwardController],
  providers: [AwardService],
  exports: [AwardService]
})
export class AwardModule {}
