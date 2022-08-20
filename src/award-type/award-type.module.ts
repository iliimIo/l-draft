import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AwardTypeController } from './award-type.controller'
import { AwardTypeManagementController } from './award-type-management.controller'
import { AwardTypeService } from './award-type.service'
import { AwardTypeRepository } from './award-type.repository'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([AwardTypeRepository]), forwardRef(() => AuthModule)],
  controllers: [AwardTypeManagementController, AwardTypeController],
  providers: [AwardTypeService],
  exports: [AwardTypeService]
})
export class AwardTypeModule {}
