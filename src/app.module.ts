import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { ConfigModule } from '@nestjs/config'
import { configValidationSchema } from './config.schema'
import { CategoriesModule } from './categories/categories.module'
import { TypeModule } from './type/type.module'
import { GroupModule } from './group/group.module';
import { AwardModule } from './award/award.module';

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
    GroupModule,
    AwardModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
console.info(`🚀  ~ MODE : ${process.env.MODE}  ~ 🚀`)
