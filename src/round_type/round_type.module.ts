import { Module, forwardRef } from '@nestjs/common';
import { RoundTypeService } from './round_type.service';
import { RoundTypeController } from './round_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoundTypeRepository } from './round_type.repository';
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([RoundTypeRepository]),
    forwardRef(() => AuthModule),
  ],
  controllers: [RoundTypeController],
  providers: [RoundTypeService]
})
export class RoundTypeModule {}
