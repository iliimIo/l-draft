import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm/dist'
import { GroupController } from './group.controller'
import { GroupService } from './group.service'
import { GroupRepository } from './group.repository'

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepository])],
  controllers: [GroupController],
  providers: [GroupService]
})
export class GroupModule {}
