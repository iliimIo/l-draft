import { GroupModule } from './../group/group.module'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AwardManagementController } from './award-menegement.controller'
import { AwardController } from './award.controller'
import { AwardService } from './award.service'
import { AwardRepository } from './award.repository'
import { AuthModule } from 'src/auth/auth.module'
import { AwardTypeModule } from 'src/award-type/award-type.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([AwardRepository]),
    forwardRef(() => AuthModule),
    forwardRef(() => AwardTypeModule),
    forwardRef(() => GroupModule)
  ],
  controllers: [AwardController, AwardManagementController],
  providers: [AwardService],
  exports: [AwardService]
})
export class AwardModule {}
