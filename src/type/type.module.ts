import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeController } from './type.controller'
import { TypeService } from './type.service'
import { TypeRepository } from './type.repository'

@Module({
  imports: [TypeOrmModule.forFeature([TypeRepository])],
  controllers: [TypeController],
  providers: [TypeService]
})
export class TypeModule {}
