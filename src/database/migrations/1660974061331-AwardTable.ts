import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class AwardTable1660974061331 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'award',
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
            name: 'reward_date',
            type: 'timestamp',
            isNullable: false,
            isUnique: false
          },
          {
            name: 'start_date',
            type: 'timestamp',
            isNullable: false,
            isUnique: false
          },
          {
            name: 'end_date',
            type: 'timestamp',
            isNullable: false,
            isUnique: false
          },
          {
            name: 'number',
            type: 'varchar',
            length: '255',
            isNullable: false
          },
          {
            name: 'no', // sequential run number
            type: 'integer'
          },
          {
            name: 'is_award',
            type: 'boolean',
            default: false
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
      'award',
      new TableIndex({
        name: 'IDX_AWARD_ID',
        columnNames: ['id']
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('award')
  }
}
