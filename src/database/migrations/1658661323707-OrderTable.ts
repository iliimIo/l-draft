import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class OrderTable1658661323707 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          }
          //   {
          //     name: 'number',
          //     type: 'varchar',
          //     length: '255',
          //     isNullable: false
          //   },
          //   {
          //     name: 'period_date',
          //     type: 'timestamp',
          //     isNullable: false,
          //     isUnique: false
          //   },
          //   {
          //     name: 'no',
          //     type: 'integer'
          //   },
          //   {
          //     name: 'is_active',
          //     type: 'boolean',
          //     default: true
          //   },
          //   {
          //     name: 'created_at',
          //     type: 'timestamp',
          //     default: 'now()'
          //   },
          //   {
          //     name: 'updated_at',
          //     type: 'timestamp',
          //     isNullable: true
          //   },
          //   {
          //     name: 'deleted_at',
          //     type: 'timestamp',
          //     isNullable: true
          //   }
        ]
      })
    )

    await queryRunner.createIndex(
      'order',
      new TableIndex({
        name: 'IDX_ORDER_ID',
        columnNames: ['id']
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('order')
  }
}
