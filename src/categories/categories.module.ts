import { TypeOrmModule } from '@nestjs/typeorm'
import { Module, forwardRef } from '@nestjs/common'
import { CategoriesController } from './categories.controller'
import { CategoriesManagementController } from './categories-management.controller'
import { CategoriesService } from './categories.service'
import { CategoriesRepository } from './categories.repository'
import { AuthModule } from 'src/auth/auth.module'
import { AwardModule } from 'src/award/award.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriesRepository]),
    forwardRef(() => AuthModule),
    forwardRef(() => AwardModule)
  ],
  controllers: [CategoriesController, CategoriesManagementController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {}
