import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { AppService } from './app.service'
// import { DatabaseModule } from './database/database.module'
import { ConfigModule } from '@nestjs/config'
import { configValidationSchema } from './config.schema'
import { CategoriesModule } from './categories/categories.module'
import { AwardTypeModule } from './award-type/award-type.module'
import { GroupModule } from './group/group.module'
import { AwardModule } from './award/award.module'
import { AuthModule } from './auth/auth.module'
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module'
import { RoundTypeModule } from './round-type/round-type.module'
import { RoundModule } from './round/round.module'
import { TypeOrmModule } from '@nestjs/typeorm'
// migrate by entity
import { Award } from './award/entities/award.entity'
import { AwardType } from './award-type/entities/award-type.entity'
import { Categories } from './categories/entities/categories.entity'
import { Group } from './group/entities/group.entity'
import { Round } from './round/entities/round.entity'
import { RoundType } from './round-type/entities/round-type.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env.dev`,
      isGlobal: true,
      validationSchema: configValidationSchema
    }),
    ScheduleModule.forRoot(),
    // DatabaseModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Award, AwardType, Categories, Group, Round, RoundType],
      migrations: ['dist/database/seeders/*{.js}'],
      migrationsRun: true,
      autoLoadEntities: true,
      synchronize: true //อันตรายห้ามเปิด
    }),
    CategoriesModule,
    AwardTypeModule,
    GroupModule,
    AwardModule,
    AuthModule,
    ExchangeRateModule,
    RoundTypeModule,
    RoundModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
console.info(`🚀  ~ MODE : ${process.env.MODE}  ~ 🚀`)
