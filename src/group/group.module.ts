import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm/dist'
import { GroupController } from './group.controller'
import { GroupManagementController } from './group-management.controller'
import { GroupService } from './group.service'
import { GroupRepository } from './group.repository'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepository]), forwardRef(() => AuthModule)],
  controllers: [GroupController, GroupManagementController],
  providers: [GroupService]
})
export class GroupModule {}
