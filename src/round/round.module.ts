import { Module, forwardRef } from '@nestjs/common'
import { RoundService } from './round.service'
import { RoundController } from './round.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { RoundRepository } from './round.repository'
import { RoundManagementController } from './round-management.controller'
import { RoundTypeModule } from 'src/round-type/round-type.module'
import { GroupModule } from 'src/group/group.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([RoundRepository]),
    forwardRef(() => AuthModule),
    forwardRef(() => RoundTypeModule),
    forwardRef(() => GroupModule)
  ],
  controllers: [RoundManagementController, RoundController],
  providers: [RoundService],
  exports: [RoundService]
})
export class RoundModule {}
