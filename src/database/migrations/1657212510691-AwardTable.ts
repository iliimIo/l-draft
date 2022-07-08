import { MigrationInterface, QueryRunner, TableIndex, Table } from 'typeorm'

export class AwardTable1657212510691 implements MigrationInterface {
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
            name: 'number',
            type: 'varchar',
            length: '255',
            isNullable: false
          },
          {
            name: 'period_date',
            type: 'timestamp',
            isNullable: false,
            isUnique: false
          },
          {
            name: 'is_active',
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
      'type',
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
