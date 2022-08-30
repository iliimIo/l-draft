import { Module, forwardRef } from '@nestjs/common'
import { RoundService } from './round.service'
import { RoundController } from './round.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { RoundRepository } from './round.repository'

@Module({
  imports: [TypeOrmModule.forFeature([RoundRepository]), forwardRef(() => AuthModule)],
  controllers: [RoundController],
  providers: [RoundService]
})
export class RoundModule {}
