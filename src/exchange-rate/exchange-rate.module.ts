import { GroupModule } from './../group/group.module'
import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { ExchangeRateController } from './exchange-rate.controller'
import { ExchangeRateManagementController } from './exchange-rate-management.controller'
import { ExchangeRateService } from './exchange-rate.service'
import { ExchangeRateRepository } from './exchange-rate.repository'
import { AwardTypeModule } from 'src/award-type/award-type.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([ExchangeRateRepository]),
    forwardRef(() => AuthModule),
    forwardRef(() => GroupModule),
    forwardRef(() => AwardTypeModule)
  ],
  controllers: [ExchangeRateManagementController, ExchangeRateController],
  providers: [ExchangeRateService]
})
export class ExchangeRateModule {}
