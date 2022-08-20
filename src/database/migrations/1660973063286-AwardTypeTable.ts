import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class AwardTypeTable1660973063286 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'award_type',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true
          },
          {
            name: 'digit', // sequential run number
            type: 'integer',
            default: 0
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true
          },
          {
            name: 'is_enabled',
            type: 'boolean',
            default: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true
          }
        ]
      })
    )

    await queryRunner.createIndex(
      'award_type',
      new TableIndex({
        name: 'IDX_AWARD_TYPE_ID',
        columnNames: ['id']
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('award_type')
  }
}
