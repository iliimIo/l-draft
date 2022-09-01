import { Module, forwardRef } from '@nestjs/common'
import { RoundTypeService } from './round-type.service'
import { RoundTypeController } from './round-type.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoundTypeRepository } from './round-type.repository'
import { AuthModule } from 'src/auth/auth.module'
import { RoundTypeManagementController } from './round-type-management.controller'

@Module({
  imports: [TypeOrmModule.forFeature([RoundTypeRepository]), forwardRef(() => AuthModule)],
  controllers: [RoundTypeManagementController, RoundTypeController],
  providers: [RoundTypeService],
  exports: [RoundTypeService]
})
export class RoundTypeModule {}
