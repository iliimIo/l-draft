import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: ['src/entities/*.entity{ .ts,.js}'],
        migrationsTableName: 'migrations_typeorm',
        migrations: ['dist/database/migrations/*{.ts,.js}', 'dist/database/seeders/*{.ts,.js}'],
        migrationsRun: true,
        autoLoadEntities: true,
        synchronize: configService.get('DATABASE_SYNC')
        // logging: ['query', 'error']
      })
    })
  ]
})
export class DatabaseModule {}
