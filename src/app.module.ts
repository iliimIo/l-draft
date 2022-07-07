import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { configValidationSchema } from './config.schema'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { CategoriesModule } from './categories/categories.module';
import { TypeModule } from './type/type.module';
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module';
import { LottoModule } from './lotto/lotto.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      validationSchema: configValidationSchema
    }),
    DatabaseModule,
    CategoriesModule,
    TypeModule,
    ExchangeRateModule,
    LottoModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
console.info(`🚀  ~ MODE : ${process.env.MODE}  ~ 🚀`)
