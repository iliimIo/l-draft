import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeController } from './type.controller'
import { TypeManagementController } from './type-management.controller'
import { TypeService } from './type.service'
import { TypeRepository } from './type.repository'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([TypeRepository]), forwardRef(() => AuthModule)],
  controllers: [TypeController, TypeManagementController],
  providers: [TypeService],
  exports: [TypeService]
})
export class TypeModule {}
