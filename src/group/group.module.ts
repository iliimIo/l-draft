import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm/dist'
import { GroupController } from './group.controller'
import { GroupManagementController } from './group-management.controller'
import { GroupService } from './group.service'
import { GroupRepository } from './group.repository'
import { AuthModule } from 'src/auth/auth.module'
import { AwardModule } from 'src/award/award.module'
import { CategoriesModule } from 'src/categories/categories.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupRepository]),
    forwardRef(() => AuthModule),
    forwardRef(() => AwardModule),
    forwardRef(() => CategoriesModule)
  ],
  controllers: [GroupManagementController, GroupController],
  providers: [GroupService],
  exports: [GroupService]
})
export class GroupModule {}
